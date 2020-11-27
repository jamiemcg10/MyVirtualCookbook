let express = require('express');
let path = require('path');
let router = express.Router();

const validation = require('../modules/validation.js');


router.all('*', (req, res, next)=>{
    let data = req.session.data || {};
    req.session.data = data;

    next();

});
// set display paths
router.get("/", validation.redirectToMain, (req,res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/signup", validation.redirectToMain, (req,res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/login", validation.redirectToMain, (req,res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/about", (req,res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/main", validation.checkToken, (req,res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/notes/:chapter/:recipeNameId", validation.checkToken, (req,res) => { 
    // TODO: make sure link is valid - or send to 404 -- maybe
    console.log("trying to open notes page");
    //console.log(`token: ${req.session.data.token}`);
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/recipe/:chapter/:recipeNameId", validation.checkToken, (req,res) => { 
    // TODO: make sure link is valid - or send to 404 -- maybe
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/logout", (req,res) => {  // remove token and send to homepage
    req.session.data.token = null;
    res.redirect("/");
});


// /// move to separate file
// function redirectToMain(req, res, next){  // might also want to move this
//     let token = req.session.data.token;

//     if(token){
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err){
//                 next();
//             } else { // has valid token
//                 res.redirect("/main");
//             }
//         });
//     } else { // there is no token
//         next();
//     }
// }

// function checkToken(req, res, next){   // this can possibly live in a separate module

//     let token = req.session.data.token;
//     console.log("123"+token);
//     if (token){ // there is a token - check it
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
//             console.log(decoded);
//             if (err){
//                 return res.json({
//                     success: false,
//                     message: 'Token is not valid'
//                 });
//             } else { // token is valid
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {  // there is no token
//         //res.redirect("http://localhost:5000/login");
//         res.redirect("/login");
//     }
// }

module.exports = router;