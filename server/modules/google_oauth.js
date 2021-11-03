const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
const { userMdl } = require('../models/User.js');
const { chapterMdl } = require('../models/Chapter.js');

passport.use(new GoogleStrategy({
    callbackURL: process.env.GOOGLE_CALLBACK_URL, // same URI as registered in Google console portal
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
async function (accessToken, refreshToken, profile, done) {
        let user_email = profile.emails && profile.emails[0].value; // profile object has the user info
        let user_id = profile.id;  // get Google's id

        try {
            // lookup user by email address and id
            let userWithEmail = await userMdl.findOne({"email": user_email, "googleUserId": user_id}, function(err, results){
                if (err){
                    fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                            body: JSON.stringify({"text": err.message}),
                            headers: { 'Content-type': 'application/json', }});
                }
            });

            // lookup user by email address
            let user = await userMdl.findOne({"email": user_email}, function(err, results){
                if(err){
                    fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                            body: JSON.stringify({"text": err.message}),
                            headers: { 'Content-type': 'application/json', }});
                }
            });

            if (user && !userWithEmail){  // user signed up with facebook - add google ID
                user.googleUserId = user_id;
                await user.save();
                userWithEmail = user;
            } else if  (!user && !userWithEmail) {
                // user doesn't exist - create new user
                let newUser = userMdl({"googleUserId": profile.id, "facebookUserId":"","email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
                newUser.chapterList.push(chapterMdl({"chapterName": "[Unclassified]"}));
                newUser.save((err)=>{
                    if (err){
                        fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                                body: JSON.stringify({"text": err.message}),
                                headers: { 'Content-type': 'application/json', }});
                        }
                });
                userWithEmail = newUser;
            } 

            console.log(user)

            const token = jwt.sign(userWithEmail.toJSON(), process.env.JWT_SECRET, {expiresIn: '1y'}); // generating token
            console.log(token)
            return done(null, {"user": userWithEmail, "token": token});
        
    } catch (error) {
        console.log(error.message)
        fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
            body: JSON.stringify({"text": error.message}),
            headers: { 'Content-type': 'application/json', }});
        done(error);
    }
}));