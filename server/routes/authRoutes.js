let express = require('express');
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
    req.session.data.userid = req.user.user._id.$oid;
    req.session.data.username = req.user.user.firstName;
    res.redirect("/main"); 
});

// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], session: true}));
router.get('/auth/facebook/redirect', passport.authenticate('facebook', {session: false, failureRedirect: '/login'}), (req,res) => {
    // Successful authentication
    req.session.data.token = req.user.token;
    req.session.data.userid = req.user.user._id.$oid;
    req.session.data.username = req.user.user.firstName;
    res.redirect("/main");
});

// Local routes
router.post('/auth/login', passport.authenticate('local', {session: false}), (req,res)=>{
    // successful authentication
    if (req.user.valid) {
        req.session.data.token = req.user.token;
        req.session.data.userid = req.user.user._id.$oid;
        req.session.data.username = req.user.user.firstName;
        return res.json({
            success: true
        });
    } else {
        return res.json({
            success: false
        });
    }
});


module.exports = router;