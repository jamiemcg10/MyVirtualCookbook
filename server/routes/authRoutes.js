let express = require('express');
let path = require('path');
let router = express.Router();

const passport = require('passport');
const GAuth = require('../modules/google_oauth.js');
const FAuth = require('../modules/facebook_oauth.js');
const LAuth = require('../modules/local_oauth.js');


// Google routes
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], session: true}));
router.get('/auth/google/redirect', passport.authenticate('google', {session: false, failureRedirect: `/login`}), (req, res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id;
    req.session.data.username = req.user.user.firstName;
    //console.log(`id: ${req.session.data.id}`);
    res.redirect("/main"); 
});

// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: true}));
router.get('/auth/facebook/redirect', passport.authenticate('facebook', {session: false, failureRedirect: '/login'}), (req,res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id;
    req.session.data.username = req.user.user.firstName;
    //console.log(`id: ${req.session.data.userid}`);
    res.redirect("/main");
});

// Local routes
router.post('/auth/login', passport.authenticate('local', {session: false, failureRedirect: '/login'}), (req,res)=>{
    console.log("authenticated");
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id;
    req.session.data.username = req.user.user.firstName;
    res.json({
        success: true
    });
});


module.exports = router;