const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');



passport.use(new GoogleStrategy({
    callbackURL: `http://localhost:5000/auth/google/redirect`, // same URI as registered in Google console portal
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
},
async function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        let user_email = profile.emails && profile.emails[0].value; // profile object has the user info
        console.log(`user email ${user_email}`);

        try {
            let user = await userMdl.findOne({"email": user_email}, function(queryErr, results){
                if(queryErr){
                    throw queryErr;
                }
        
            });

            console.log(`user: ${user}`);


            if (!user) {
                // user doesn't exist - create new user
                let newUser = userMdl({"googleUserId": profile.id, "email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
                newUser.save();
                user = newUser;
            }

            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token
            return done(null, {"user": user, "token": token});
        
    } catch (error) {
        done(error);
    }
}));