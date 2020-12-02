const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const fs = require('fs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config(); // for using environment variables
const md5 = require('md5');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

// for mongodb
const mongoose = require('mongoose');
const { userMdl } = require('./server/models/User.js');
const { chapterMdl } = require('./server/models/Chapter.js');
const { recipeMdl } = require('./server/models/Recipe.js');
const Users = mongoose.model('Users', userMdl.schema);
const Chapter = mongoose.model('Chapter', chapterMdl.schema);
const Recipe = mongoose.model('Recipe', recipeMdl.schema);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
let errorLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(logger('combined', {stream: accessLogStream, 
                            skip: function(req,res) { return res.statusCode < 400 },
}));
app.use(logger('dev'));

// import routes
const displayRoutes = require('./server/routes/displayRoutes.js');
const authRoutes = require('./server/routes/authRoutes.js');

// use session
app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: true
  }));

// use routes from routers
app.use(displayRoutes);
app.use(authRoutes);

app.use('/client/build', express.static(__dirname + "/client/build"));  // serve build files from React build folder

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`MyVirtualCookbook is listening on port ${port}`);
errorLogStream.write(`${new Date().toLocaleString('en-US',{ timeZone: 'America/New_York'})}\nMyVirtualCookbook is listening on port ${port}`);

// connect to MongoDB
mongoose.connect(
    process.env.DB_ADDRESS,
    { useNewUrlParser: true,
      useUnifiedTopology: true
    }
);

mongoose.connection.on('connected', ()=>{
    console.log("Connected to database");

});

mongoose.connection.on('disconnected', ()=>{
    console.log("Disconnected from database");
});


// api routes
app.post('/api/log', async(req, res)=>{
    let text = req.body.text;
    errorLogStream.write(`${new Date().toLocaleString('en-US',{ timeZone: 'America/New_York'})}\n${req.session.data.userId || ''}\n${text}`);
    res.end();
});
app.post('/api/signup', async(req, res)=>{
    // make sure user doesn't already exist
    let firstName = req.body.firstName;
    let email = req.body.email;
    let md5Password = req.body.password;
    let hashedPassword = bcrypt.hashSync(md5Password, 8);

    // look for user with entered credentials
    let user = await Users.findOne({"email": email.toLowerCase()}, (queryErr, result)=>{
        if (queryErr){
            throw queryErr;
        }
        return result;
    });

    if (user){ // an account is already associated with this email address
        //TODO: this should really just merge accounts
        res.json({
            success: false,
            message: "A user with this email address already exists"
        });
    } else {
        // create and save new user
        let newUser = userMdl({"email": email.toLowerCase(), "firstName": firstName, "password": hashedPassword});
        newUser.chapterList.push(chapterMdl({"chapterName": "[Unclassified]"}));
        newUser.save();

        // set session data
        const token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token
        req.session.data.token = token;
        req.session.data.userid = newUser._id;
        req.session.data.username = newUser.firstName;

        res.json({
            success: true
        });
    
    }
});

// get array of all chapter names
app.get('/api/chapters', async (req, res)=>{  
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for /api/chapters");
        let chapterNames = [];

        let user = await getUser(req);

        if (user) {  // user returned is valid
            user.chapterList.forEach((chapter)=>{  
                chapterNames.push(chapter.chapterName);
            });
            
            return res.json({
                success: true,
                message: `Fetched chapters successfully`,
                chapters: chapterNames
            });

        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }
        

    } else { // token is not valid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }
});

// add chapter
app.post('/api/chapter/add/:chapterName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for adding a chapter");
        let newChapterName = req.params.chapterName;
        
        
        let user = await getUser(req);
        if (user) {  // user returned is valid
            // check to make sure a chapter with this name isn't already in the cookbook
            for (let i=0; i<user.chapterList.length; i++){
                let chapter = user.chapterList[i];
                if (chapter.chapterName.toLowerCase() === newChapterName.toLowerCase()){
                    return res.json({
                        success: false,
                        message: "A chapter with this name already exists."
                    });
                }
            }
            
            // if here - chapter is not already in cookbook
            // create chapter, add to chapter list and save user
            let newChapter = new Chapter({
                                    "chapterName": newChapterName
                                });
            user.chapterList.push(newChapter);
            user.save((err)=>{
                if (err){
                    throw err;
                }
            });
            return res.json({
                success: true,
                message: `${newChapterName} was added successfully`
            });
        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }

    } else { // token invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// rename chapter
app.put('/api/chapter/rename/:oldChapterName/:newChapterName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for changing name of chapter");
        let oldChapterName = req.params.oldChapterName;
        let newChapterName = req.params.newChapterName;
        
        let user = await getUser(req);
        if (user) {  // user returned is valid
            // look for a chapter with the same name as the new chapter name
            let newChapter = user.chapterList.find((chapter) => {
                return chapter.chapterName.toLowerCase() === newChapterName.toLowerCase();
            });
            
            if (newChapter){  // a chapter with the new name already exists
                return res.json({
                    success: false,
                    message: "A chapter with this name already exists"
                });
            }

            // if here - chapter name is not already in cookbook
            let oldChapter = user.chapterList.find((chapter) => {   // find the chapter the recipe is currently in
                return chapter.chapterName === oldChapterName;
            });
            
            if (oldChapter){  // the old chapter exists
                // rename chapter and save user
                oldChapter.chapterName = newChapterName; 
                user.save((err)=>{
                    if (err){
                        throw err;
                    }
                });
                return res.json({
                    success: true,
                    message: `${oldChapterName} was changed to ${newChapterName}`
                });
            } else {  // this shouldn't happen
                return res.json({
                    success: false,
                    message: "An error occured"
                });
            }    
        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        } 

    } else { // token is invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// rename recipe
app.put('/api/recipe/rename/:oldRecipeName/:recipeChapter/:newRecipeName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for changing name of recipe");
        let oldRecipeName = req.params.oldRecipeName;
        let newRecipeName = req.params.newRecipeName;
        let recipeChapter = req.params.recipeChapter;
        let oldRecipeNameId = oldRecipeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        let newRecipeNameId = newRecipeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        
        let user = await getUser(req);
        if (user) {  // user returned is valid
            let chapter = user.chapterList.find((chap) => {   // find the chapter the recipe is currently in
                return chap.chapterName === recipeChapter;
            });
            
            if (chapter){  // the chapter exists
                let existingRecipe = chapter.recipes.find((recipe) => {
                    return recipe.nameId === newRecipeNameId;
                });

                if (!existingRecipe){  // there is not a recipe with the new name
                    existingRecipe = chapter.recipes.find((recipe) => {
                        return recipe.nameId === oldRecipeNameId;
                    }); 

                    if (existingRecipe){  // found the recipe by the old name - change name and nameId and save
                        existingRecipe.nameId = newRecipeNameId;
                        existingRecipe.name = newRecipeName;

                        user.save((err)=>{
                            if (err){
                                throw err;
                            }
                        });
                        return res.json({
                            success: true,
                            message: `${oldRecipeName} was changed to ${newRecipeName}`
                        });
                    }

                } else { // there is a recipe with the new name already in chapter
                    return res.json({
                        success: false,
                        message: 'A recipe with this name already exists'
                    });
                }
                
            } else {  // this shouldn't happen
                return res.json({
                    success: false,
                    message: "An error occured"
                });
            }
            
        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }

    } else {  // token is invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// delete chapter
app.delete('/api/chapter/delete/:chapterName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for deleting chapter");
        let chapterName = req.params.chapterName;
        
        let user = await getUser(req);
        if (user) {  // user returned is valid
            let chapterIndex = user.chapterList.findIndex((chapter) => {
                return chapter.chapterName === chapterName;
            });
            
            if (chapterIndex === -1){  // this shouldn't happen, but the chapter doesn't exist
                return res.json({
                    success: false,
                    message: "An error has occured"
                });
            } else { // chapter was found - remove from chapterList and save
                user.chapterList.splice(chapterIndex,1);
                user.save();
                res.json({
                    success: true,
                    message: `${chapterName} was deleted`
                });
            }
            
        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }
    
    } else {  // token is invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// delete recipe
app.delete('/api/recipe/delete/:recipeChapter/:recipeName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for deleting recipe");
        let recipeName = req.params.recipeName;
        let recipeChapter = req.params.recipeChapter;
        let recipeNameId = recipeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        
        let user = await getUser(req);
        if (user) {  // user returned is valid
            
            let chapter = user.chapterList.find((chapter) => {   // find the chapter the recipe is currently in
                return chapter.chapterName === recipeChapter;
            });
            
            if (chapter){  // the chapter exists
                let recipeIndex = chapter.recipes.findIndex((recipe) => {
                    return recipe.nameId === recipeNameId;
                });

                if (recipeIndex > -1){ // the recipe exists - remove it from the chapter and save the user
                 
                        chapter.recipes.splice(recipeIndex, 1);

                        user.save((err)=>{
                            if (err){
                                throw err;
                            }
                        });
                        return res.json({
                            success: true,
                            message: `${recipeName} was deleted`
                        });
                } else { // recipe doesn't exist - shouldn't happen
                    console.log("recipe doesn't exist");    
                    return res.json({
                        success: false,
                        message: 'An error has occured'
                    });
                }
                
            } else {  // this shouldn't happen - the chapter doesn't exist
                console.log("chapter doesn't exist");
                return res.json({
                    success: false,
                    message: "An error occured"
                });
            }
            
        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }
        
    } else {  // token is invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// move a recipe from one chapter to another
app.put('/api/recipe/move/:oldChapter/:oldChapterIndex/:newChapter/:newChapterIndex', async (req, res)=>{
    // TODO: this should check for duplicates
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid to move recipe");
        
        let user = await getUser(req);
        if (user){
            let recipeId = req.params.recipeNameId;
            let oldChapterName = req.params.oldChapter;
            let newChapterName = req.params.newChapter;

            let oldChapter = user.chapterList.find((chapter) => {   // find the chapter the recipe is currently in
                return chapter.chapterName === oldChapterName;
            });
           

            let newChapter = user.chapterList.find((chapter) => {  // find the chapter the recipe should be moved to
                return chapter.chapterName === newChapterName;
            });
            
        
            // let recipeIndex = oldChapter.recipes.findIndex((recipe)=>{  // find the position of the recipe in the old chapter
            //     return recipe.nameId === recipeId;
            // });

            let recipeIndex = req.params.oldChapterIndex;
            let newRecipeIndex = req.params.newChapterIndex;

            let recipe = oldChapter.recipes[recipeIndex];  // get the recipe to be moved
        
            console.log(`old index: ${recipeIndex}`);
            console.log(`new index: ${newRecipeIndex}`);
            if (recipe){  // if the recipe exists
                if (oldChapterName === newChapterName){ // recipe being moved in same chapter
                    // create deep clones to move recipe without disturbing chapter order
                    let recipeCopy = _.cloneDeep(recipe);
                    if (recipeIndex > newRecipeIndex){  // being moved up
                        newChapter.recipes.splice(recipeIndex, 1);  // remove the recipe from the old location
                        newChapter.recipes.splice(newRecipeIndex,0,recipeCopy);  // insert the recipe into the new location
                    } else if (recipeIndex < newRecipeIndex){  
                        newChapter.recipes.splice(recipeIndex,1);  // insert the recipe into the new chapter
                        newChapter.recipes.splice(newRecipeIndex,0,recipeCopy); // remove the recipe from the old chapter
                    }
                    //newChapter.recipes.push(recipe);  // add the recipe to the new chapter
                } else {
                    newChapter.recipes.splice(newRecipeIndex,0,recipe);  // insert the recipe into the new chapter
                    oldChapter.recipes.splice(recipeIndex, 1);  // remove the recipe from the old chapter
                }

                user.save();
                return res.json({
                    success: true,
                });
            }
        }
        
    }

    // token, user, chapter, or recipe is invalid or not found
    return res.json({
        success: false,
        message: "Please log in."
    });
});

// get recipe
app.get('/api/recipe/:chapterName/:recipeNameId', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        let recipeChapter = req.params.chapterName;
        let recipeNameId = req.params.recipeNameId;

        console.log(`recipeChapter: ${recipeChapter}`);
        console.log(`recipeNameId: ${recipeNameId}`)

        let user = await getUser(req);
        if (user){
            for (let i=0; i<user.chapterList.length; i++){
                let chapter = user.chapterList[i];
                if (chapter.chapterName === recipeChapter){ // this is the right chapter
                    for (let i=0; i<chapter.recipes.length; i++){
                        let recipe = chapter.recipes[i];
                        if (recipe.nameId === recipeNameId){  
                            return res.json(
                                {
                                    success: true,
                                    recipe: recipe,
                                }
                            );
                        }
                    }
                }
            }

            return res.json({
                success: false,
                message: 'Chapter or recipe not found'
            });

        } else { // the user was not successfully returned
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } else {  // token invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// get recipe notes
app.get('/api/recipe/notes/:chapterName/:recipeNameId', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        let recipeChapter = req.params.chapterName;
        let recipeNameId = req.params.recipeNameId;

        let user = await getUser(req);
        if (user){  // user found
            for (let i=0; i<user.chapterList.length; i++){ // iterate through chapters
                let chapter = user.chapterList[i];
                if (chapter.chapterName === recipeChapter){ // this is the right chapter
                    for (let i=0; i<chapter.recipes.length; i++){  // iterate through recipes
                        let recipe = chapter.recipes[i];
                        if (recipe.nameId === recipeNameId){   // this is the right recipe
                            return res.json({
                                    success: true,
                                    notes: recipe.recipeNotes,
                                }
                            );
                        }
                    }
                }
            }

            // couldn't find chapter or recipe
            return res.json({
                success: false,
                message: 'Chapter or recipe not found'
            });

        } else { // the user was not successfully returned
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
    } else { // token is not valid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// get all chapters & recipes - returns chapterList
app.get('/api/recipes', async (req, res)=>{  
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid for /api/recipes");
        
        let user = await getUser(req);
        
        if (user) {  // user returned is valid

            return res.json({
                success: true,
                message: `Fetched recipes successfully`,
                recipes: user.chapterList
            });

        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later.",
                recipes: []
            });
        }
    
    } else { // token is invalid
        return res.json({
            success: false,
            message: "Please log in.",
            recipes: []
        });
    }
});


// add recipe
app.post('/api/recipe/add', async (req, res)=>{
    let token = req.session.data.token;

    if (isValidToken(token)){
        console.log("token is valid to add recipe");
        let newRecipeName = req.body.name;
        let newRecipeLink = req.body.link;
        let newRecipeChapter = req.body.chapter;
        let newRecipeSource = req.body.source;
        let newRecipeNameId = newRecipeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        // add http:// if missing from user-supplied link
        if (newRecipeLink.substring(0,4) === "www."){
            newRecipeLink = 'http://' + newRecipeLink;
        }

        // figure out if link can be shown in iframe
        let displayMethod = 'iframe';
        
        await fetch(newRecipeLink).then(
            (response) => {
                if (response.headers.has('x-frame-options')){ // if this is set, page won't load in iframe - load it in new window
                    displayMethod = 'new_window'
                }
            }
        ).catch((error)=>{
            console.log(error);
        });

        let user = await getUser(req);

        if (user) {  // user returned is valid
            // create new recipe            
            let newRecipe = new Recipe({
                                "name": newRecipeName, 
                                "nameId": newRecipeNameId,
                                "source": newRecipeSource, 
                                "recipeLink": newRecipeLink,
                                "method": displayMethod,
                                "recipeNotes": ""
                            });

            // find chapter to add to - create if doesn't exist
            let chapterFound = false;

            for (let i=0; i<user.chapterList.length; i++) {  // look for chapter
                let chapter = user.chapterList[i];
                if (chapter.chapterName.toLowerCase() === newRecipeChapter.toLowerCase()){ // chapter already exists
                    chapterFound = true;
                    //loop through recipes to make sure nameID doesn't already exist
                    for (let i=0; i<chapter.recipes.length; i++) {
                        let recipe = chapter.recipes[i];
                        if (recipe.nameId === newRecipeNameId){
                            return res.json({
                                success: false,
                                message: "A recipe with this name already exists in this chapter."
                            });
                        }
                    }

                    // recipe is not already in chapter
                    chapter.recipes.push(newRecipe);
                }
            };

            if (!chapterFound){  // chapter does not exist - create and add recipe to chapter and save user
                let newChapter = new Chapter({"chapterName": newRecipeChapter});
                newChapter.recipes.push(newRecipe);
                user.chapterList.push(newChapter);

            }

            // save user with new recipe
            user.save((err)=>{
                if (err){
                    throw err;
                }
                
                return res.json({
                    success: true,
                    message: `${newRecipeName} was added successfully`
                });
            });

        } else {  // problem with retrieving user - return error message
            return res.json({
                success: false,
                message: "There was a problem retrieving your data. Please try again later."
            });
        }

    } else { // token is invalid
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

// check if link can still load in iframe
app.post('/api/checkIframe', async(req,res)=>{
    let recipeLink = req.body.link;

    // try to fetch link
    await fetch(recipeLink).then(
        (response) => {
            if (response.headers.has('x-frame-options')){ // if this is set, page won't load in iframe - load it in new window
                displayMethod = 'new_window'
                res.json({
                    method: 'new_window'
                });
            } else {
                res.json({
                    method: 'iframe'
                });
            }            
        }
    ).catch((error)=>{
        console.log(error);
        res.json({
            method: 'new_window'
        });
    });


});

//update recipe opening method
app.post('/api/updateRecipeMethod', async(req,res)=>{
  
    getUser(req).then((user)=>{ // doesn't need to be asynchronous
        let recipeNameId = req.body.nameId;
        let recipeChapter = req.body.chapter;

        let targetChapter = user.chapterList.find((chapter)=>{  // get chapter recipe is in
            return chapter.chapterName === recipeChapter;
        });

        if (targetChapter){  // chapter was found
            let targetRecipe = targetChapter.recipes.find((recipe)=>{  // get recipe from chapter
                return recipe.nameId === recipeNameId;
            });

            if (targetRecipe){  // recipe exists - update method and save user
                targetRecipe.method = 'new_window';
                user.save();
            }
        }

        // no response is needed
        res.end();    
    });

});


// update notes
app.post('/api/recipes/update_notes/:chapter/:recipe', async (req,res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){  // check token
        let recipeChapter = req.params.chapter;
        let recipeNameId = req.params.recipe;
        let recipeNotes = req.body.notes;

        let user = await getUser(req);  // make this asynchronous if it ever takes too long to update notes
        if (user) {  // user was found
            let chapter;
            for (let i=0; i<user.chapterList.length; i++){  // loop through chapters in chapterList
                let chap = user.chapterList[i];
                if (chap.chapterName === recipeChapter){  // chapter found
                    chapter = chap;
                    break;
                }
            }

            if (chapter){  // chapter was found
                for (let i=0; i<chapter.recipes.length; i++){ // loop through recipes in chapter
                    let rec = chapter.recipes[i];
                    if (rec.nameId === recipeNameId){   // recipe found
                        // TODO: do something if the recipe isn't found
                        // update notes
                        rec.recipeNotes = recipeNotes;
                        break;
                    }
                }
            } else {
                // TODO: Do something - the chapter sent in wasn't found
            }

            // save user with updated notes
            user.save((err)=>{
                if (err) {
                    throw err;
                }

                res.end();  // can send something if anything ever depends on it
            });
        }
    }

});

// check user logged in - for header
app.get('/api/user/checklogin', (req,res)=>{
    let token = req.session.data.token;
    let name = req.session.data.username;
    // console.log({
    //     validUser: isValidToken(token),
    //     name: name || ''  
    // });
    res.json({
        "validUser": isValidToken(token),
        "name": name || ''  
    });
});

app.get('/api/checkCookieAcceptance', async (req,res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        let user = await getUser(req);
        if (user.cookiesAccepted === true){ 
            return res.json({
                success: true,
                cookiesAccepted: true,
            });
        } else {
            return res.json({
                success: true,
                cookiesAccepted: false,
            });
        }
    }

    return res.json({
        success: false,
        cookiesAccepted: false,
    });
});

app.post('/api/acceptCookies', (req,res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        getUser(req).then((user)=>{
            user.cookiesAccepted = true;
            user.save();
        });

    }
    return res.end();
});


// catch all other routes - are invalid
app.all("*", (req,res) => { 
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


// get user from database
async function getUser(req){
    let userId = req.session.data.userid;
    let user = await Users.findOne({_id: userId}, (queryErr, result)=>{
        if (queryErr){
            // TODO: LOG THIS and return error message
            throw queryErr;
        }
        return result;
    });
    return user;
}


// make sure user has valid token
function isValidToken(token){ 
    let tokenIsValid = false;
    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if (err){
                return tokenIsValid;
            } 
        });
        tokenIsValid = true;
    } 

    return tokenIsValid;
}




