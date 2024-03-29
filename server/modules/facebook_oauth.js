const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');
const { chapterMdl } = require('../models/Chapter.js');


// functions to serialize and deserialize user
passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findByID(id, function(err, user){
        done(err, user);
    })
});

passport.use(new FacebookStrategy({
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email']
    },
    
    async function(accessToken, refreshToken, profile, done){
        let user_email = (profile.emails && profile.emails[0].value) || "" ;
        let user_id = profile.id;
        try {         
            // look for account with matching email and id
            let userWithEmail = await userMdl.findOne({"email": user_email, "facebookUserId": user_id}, function(err, results){
                if (err){
                    fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                        body: JSON.stringify({"text": err.message}),
                        headers: { 'Content-type': 'application/json', }});
                }
            });

            // look up user using email 
            let user;
            if (user_email !==""){
                user = await userMdl.findOne({"email": user_email}, (err, results)=>{
                    if (err){
                        fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                            body: JSON.stringify({"text": err.message}),
                            headers: { 'Content-type': 'application/json', }});
                    }
                });
            }

            if (user && !userWithEmail){  // user signed up with google - add fb id
                user.facebookUserId = user_id;
                await user.save((err)=>{
                    if (err){
                        fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                            body: JSON.stringify({"text": err.message}),
                            headers: { 'Content-type': 'application/json', }});
                    }
                });
                userWithEmail = user;
            } else if  (!user && !userWithEmail) {
                // user doesn't exist - create new user
                let newUser = userMdl({"googleUserId":"", "facebookUserId": profile.id, "email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
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

            const token = jwt.sign(userWithEmail.toJSON(), process.env.JWT_SECRET, {expiresIn: '1y'}); // generating token
            return done(null, {"user": userWithEmail, "token": token});

        } catch (error){
            fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                body: JSON.stringify({"text": error.message}),
                headers: { 'Content-type': 'application/json', }});
            done(error);
        }

        
    }
));