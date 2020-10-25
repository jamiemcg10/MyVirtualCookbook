const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');

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

            console.log(`user: ${user}`);
            console.log(`userWithEmail: ${userWithEmail}`);

            if (user && !userWithEmail){  // user signed up with google - add fb id
                user.facebookUserId = user_id;
                await user.save();
                userWithEmail = user;
            } else if  (!user && !userWithEmail) {
                // user doesn't exist - create new user
                let newUser = userMdl({"googleUserId":"", "facebookUserId": profile.id, "email": user_email, "firstName": profile.name.givenName, "lastName": profile.name.familyName});
                newUser.chapterList.push(chapterMdl({"chapterName": "<Unclassified>"}));
                newUser.save();
                userWithEmail = newUser;
            } 

            console.log(`userWithEmail: ${userWithEmail}`);

            const token = jwt.sign(userWithEmail.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token
            return done(null, {"user": userWithEmail, "token": token});

        } catch (error){
            done(error);
        }

        
    }
));