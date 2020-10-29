const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GAuth = require('./server/modules/google_oauth.js')
const FAuth = require('./server/modules/facebook_oauth.js')
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config(); // for using environment variables

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

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: true
  }));

app.use('/client/build', express.static(__dirname + "/client/build"));  // serve build files from React build folder

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

app.all('*', (req, res, next)=>{
    let data = req.session.data || {};
    req.session.data = data;

    next();

});
// set display paths
app.get("/", redirectToMain, (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/signup", redirectToMain, (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/login", redirectToMain, (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/main", checkToken, (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/notes/:chapter/:recipeNameId", checkToken, (req,res) => { 
    // TODO: make sure link is valid - or send to 404 -- maybe
    console.log("trying to open notes page");
    //console.log(`token: ${req.session.data.token}`);
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/recipe/:chapter/:recipeNameId", checkToken, (req,res) => { 
    // TODO: make sure link is valid - or send to 404 -- maybe
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/logout", (req,res) => {  // remove token and send to homepage
    req.session.data.token = null;
    res.redirect("/");
});


// Google routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], session: true}));
app.get('/auth/google/redirect', passport.authenticate('google', {session: false, failureRedirect: `http://localhost:3000/login`}), (req, res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id;
    req.session.data.username = req.user.user.firstName;
    //console.log(`id: ${req.session.data.id}`);
    res.redirect("/main"); 
});

// Facebook routes
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: true}));
app.get('/auth/facebook/redirect', passport.authenticate('facebook', {session: false, failureRedirect: '/login'}), (req,res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id;
    req.session.data.username = req.user.user.firstName;
    //console.log(`id: ${req.session.data.userid}`);
    res.redirect("/main");
});

app.get('/api/chapters', async (req, res)=>{  // get all chapter names
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid");
        let chapterNames = [];

        let user = await getUser(req);
        // let userId = req.session.data.userid;
        // let user = await Users.findOne({_id: userId}, (queryErr, result)=>{
        //     if (queryErr){
        //         // TODO: LOG THIS
        //         throw queryErr;
        //     }

        //     //console.log(result);
        //     return result;
        // });
        console.log(`user: ${user}`);
        if (user) {  // user returned is valid
            //console.log(user.chapterList);

            user.chapterList.forEach((chapter)=>{  
                //console.log(chapter.chapterName);
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
        

    } else {
        return res.json({
            success: false,
            message: "Please log in."
        });
    }
});


app.post('/api/chapter/:chapterName', async (req, res)=>{
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid");
        let newChapterName = req.params.chapterName;
        
        
        let user = await getUser(req);
        // let userId = req.session.data.userid;
        // let user = await Users.findOne({_id: userId}, (queryErr, result)=>{
        //     if (queryErr){
        //         // TODO: LOG THIS
        //         throw queryErr;
        //     }

        //     //console.log(result);
        //     return result;
        // });
        //console.log(`user: ${user}`);
        if (user) {  // user returned is valid
            console.log(user.chapterList);
            for (let i=0; i<user.chapterList.length; i++){
                //console.log(chapter.chapterName);
                let chapter = user.chapterList[i];
                if (chapter.chapterName.toLowerCase() === newChapterName.toLowerCase()){
                    return res.json({
                        success: false,
                        message: "A chapter with this name already exists."
                    });
                }
            }
            
            // if here - chapter is not already in cookbook
            //console.log("chapter not in list");
            let newChapter = new Chapter({
                                    "chapterName": newChapterName
                                });
            user.chapterList.push(newChapter);
            //console.log(typeof user.chapterList);
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
        

    } else {
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

app.get('/api/recipe/:chapterName/:recipeNameId', async (req, res)=>{
    // TODO: add user validation
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

});

app.get('/api/recipe/notes/:chapterName/:recipeNameId', async (req, res)=>{
    // TODO: add user validation
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
                                notes: recipe.recipeNotes,
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

});

app.get('/api/recipes', async (req, res)=>{  // get all chapters/recipes
    let token = req.session.data.token;
    if (isValidToken(token)){
        console.log("token is valid");
        
        let user = await getUser(req);
        
        if (user) {  // user returned is valid
            console.log(user.chapterList);

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
        

    } else {
        return res.json({
            success: false,
            message: "Please log in.",
            recipes: []
        });
    }
});

app.post('/api/recipe/add', async (req, res)=>{
    let token = req.session.data.token;

    if (isValidToken(token)){
        console.log("token is valid");
        let newRecipeName = req.body.name;
        let newRecipeLink = req.body.link;
        let newRecipeChapter = req.body.chapter;
        let newRecipeSource = req.body.source;
        // let userId = req.session.data.userid;
        let newRecipeNameId = newRecipeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

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
        }
            
        );

        let user = await getUser(req);

        // let user = await Users.findOne({_id: userId}, (queryErr, result)=>{
        //     if (queryErr){
        //         // TODO: LOG THIS and return error message
        //         throw queryErr;
        //     }

        //     console.log(result);
        //     return result;
        // });
        //console.log(`user: ${user}`);
        if (user) {  // user returned is valid
            console.log("user is valid and returned");
            
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
                //console.log(chapter.chapterName);
                if (chapter.chapterName.toLowerCase() === newRecipeChapter.toLowerCase()){
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
                    chapter.recipes.push(newRecipe);
                    
                }
            };

            if (!chapterFound){
                let newChapter = new Chapter({"chapterName": newRecipeChapter});
                newChapter.recipes.push(newRecipe);
                user.chapterList.push(newChapter);

            }

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

    } else {
        return res.json({
            success: false,
            message: "Please log in."
        });
    }

});

app.post('/api/recipes/update_notes/:chapter/:recipe', async (req,res)=>{
    // TODO: Make sure user is logged in

    let recipeChapter = req.params.chapter;
    let recipeNameId = req.params.recipe;
    console.log(req.body);
    console.log(`recipeNameId: ${recipeNameId}`);
    let recipeNotes = req.body.notes;

    let user = await getUser(req);
    console.log(`user: ${user}`);
    if (user) {

        let chapter;
        for (let i=0; i<user.chapterList.length; i++){
            let chap = user.chapterList[i];
            if (chap.chapterName === recipeChapter){
                chapter = chap;
                console.log("chapter found");
                break;
            }
        }

        if (chapter){
            for (let i=0; i<chapter.recipes.length; i++){
                let rec = chapter.recipes[i];
                console.log(`rec: ${rec}`);
                console.log(`rec: ${rec.nameId}`);
                console.log(`recipeNameId: ${recipeNameId}`);
                if (rec.nameId === recipeNameId){  // TODO: do something if the recipe isn't found
                    rec.recipeNotes = recipeNotes;
                    break;
                }
            }
        } else {
            // TODO: Do something - the chapter sent in wasn't found
        }

        user.save((err)=>{
            if (err) {
                throw err;
            }

            res.end();  // can send something if anything ever depends on it
        });
    }

});

app.get('/api/user/checklogin', (req,res)=>{
    let token = req.session.data.token;
    let name = req.session.data.username;
    console.log({
        validUser: isValidToken(token),
        name: name || ''  
    });
    res.json({
        "validUser": isValidToken(token),
        "name": name || ''  
    });
});


async function getUser(req){
    let userId = req.session.data.userid;
    let user = await Users.findOne({_id: userId}, (queryErr, result)=>{
        if (queryErr){
            // TODO: LOG THIS and return error message
            throw queryErr;
        }

        console.log(result);
        return result;
    });
    return user;
}

function isValidToken(token){ // TODO: find a way to combine these three functions
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

app.all("*", (req,res) => { 
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


function checkToken(req, res, next){   // this can possibly live in a separate module

    let token = req.session.data.token;

    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if (err){
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else { // token is valid
                req.decoded = decoded;
                next();
            }
        });
    } else {  // there is no token
        //res.redirect("http://localhost:5000/login");
        res.redirect("/login");
    }
}

function redirectToMain(req, res, next){  // might also want to move this
    let token = req.session.data.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err){
                next();
            } else { // has valid token
                res.redirect("/main");
            }
        });
    } else { // there is no token
        next();
    }
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);