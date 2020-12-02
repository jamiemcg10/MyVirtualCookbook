const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
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
            let userWithEmail = await userMdl.findOne({"email": user_email, "facebookUserId": user_id}, function(queryErr, results){
                if (queryErr){
                    throw queryErr;
                }
            });

            // look up user using email 
            let user;
            if (user_email !==""){
                user = await userMdl.findOne({"email": user_email}, (queryErr, results)=>{
                    if (queryErr){
                        throw queryErr
                    }
                });
            }

            if (user && !userWithEmail){  // user signed up with google - add fb id
                user.facebookUserId = user_id;
                await user.save();
                userWithEmail = user;
            } else if  (!user && !userWithEmail) {
                // user doesn't exist - create new user
                let newUser = userMdl({"googleUserId":"", "facebookUserId": profile.id, "email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
                newUser.chapterList.push(chapterMdl({"chapterName": "[Unclassified]"}));
                newUser.save();
                userWithEmail = newUser;
            } 

            const token = jwt.sign(userWithEmail.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token
            return done(null, {"user": userWithEmail, "token": token});

        } catch (error){
            done(error);
        }

        
    }
));