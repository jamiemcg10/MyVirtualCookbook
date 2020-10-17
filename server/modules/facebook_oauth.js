const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');
//const { query } = require('express');

passport.serializeUser(function(user, done){
    done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findByID(id, function(err, user){
        done(err, user);
    })
});

passport.use(new FacebookStrategy({
    callbackURL: "http://localhost:5000/auth/facebook/redirect",
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email']
    },
    
    async function(accessToken, refreshToken, profile, done){
        console.log(profile);
        console.log(profile.emails);
        let user_email = (profile.emails && profile.emails[0].value) || "" ;
        let user_id = profile.id;
        console.log(`user_email: ${user_email}`);
        try {            
            // look up user using id
            let user = await userMdl.findOne({"facebookUserId": user_id}, (queryErr, results)=>{
                if (queryErr){
                    throw queryErr
                }
            });

            console.log(`user: ${user}`);

            if (!user) {
                // user doesn't exist - add to db
                let newUser = userMdl({"facebookUserId": profile.id ,"email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
                newUser.save();
                user = newUser;
            }

            console.log(`user: ${user}`);

            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token
            return done(null, {"user": user, "token": token});

        } catch (error){
            done(error);
        }

        
    }
));