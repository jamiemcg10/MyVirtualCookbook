const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GAuth = require('./server/modules/google_oauth.js')
const FAuth = require('./server/modules/facebook_oauth.js')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config(); // for using environment variables


const mongoose = require('mongoose');
const { userMdl } = require('./server/models/User.js');
const { ChapterMdl } = require('./server/models/Chapter.js');
const { RecipeMdl, recipeMdl } = require('./server/models/Recipe.js');

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
    //console.log("should be setting the session data here");
    let data = req.session.data || {};
    req.session.data = data;
    //console.log(req.session.data);

    next();

});
// set display paths
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/main", checkToken, (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get("/logout", (req,res) => {  // remove token and send to homepage
    //req.logout();  // probably does nothing?
    req.session.data.token = null;
    res.redirect("http://localhost:5000/");
});


// EVENTUALLY CREATE A WAY TO MERGE ACCOUNTS
// Google routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], session: true}));
app.get('/auth/google/redirect', passport.authenticate('google', {session: false, failureRedirect: `http://localhost:3000/login`}), (req, res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    res.redirect("http://localhost:5000/main"); 
});

// Facebook routes - finish later

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: true}));
app.get('/auth/facebook/redirect', passport.authenticate('facebook', {session: false, failureRedirect: '/login'}), (req,res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    res.redirect("http://localhost:5000/main");
});

function checkToken(req, res, next){   // this can possibly live in a separate module

    let token = req.session.data.token;

    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            //console.log(decoded);
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
        res.redirect("http://localhost:5000/login");
    }
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);