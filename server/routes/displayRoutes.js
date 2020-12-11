let express = require('express');
let path = require('path');
let router = express.Router();

const validation = require('../modules/validation.js');

// for all requests
router.all('*', (req, res, next)=>{
    let data = req.session.data || {};
    req.session.data = data;

    next();
});

// set display paths
router.get("/", validation.redirectToMain, (req,res) => { //home page
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

router.get("/notes/:chapter/:recipeName", validation.checkToken, (req,res) => { 
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/recipe/:chapter/:recipeName", validation.checkToken, validation.isValidPage, (req,res) => { 
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
});

router.get("/logout", (req,res) => {  // remove token and send to homepage
    req.session.data.token = null;
    req.session.data.userid = null;
    req.session.data.username = null;
    req.session.destroy();
    res.redirect("/");
});

// for heroku app ownership verification
router.get("/google272a7713cdc3ed26.html", (req,res)=>{
    res.sendFile(path.join(process.cwd(), 'google272a7713cdc3ed26.html'));
});

module.exports = router;