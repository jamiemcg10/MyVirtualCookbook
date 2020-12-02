const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');
const bcrypt = require('bcryptjs');

// functions to serialize and deserialize user
passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

passport.use(new LocalStrategy(
    // TODO: match to other accounts
    function(username, password, done){
        // lookup user
        userMdl.findOne({"email": username.toLowerCase()}, function(err, user){
            if (err){
                console.log(err);
                return done(err);
            }

            if (!user){  // user not foudn
                console.log("no user");
                return done(null, false);
            }

            if (!bcrypt.compareSync(password, user.password)){  // compare password to hash of saved password
                console.log("password invalid");
                return done(null, false);
            } 

            console.log("password is valid");
            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token

            return done(null, {"user": user, "token": token});
        });
    }
));
