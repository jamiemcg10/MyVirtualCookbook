const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fetch = require('node-fetch');
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
    function(username, password, done){
        // lookup user
        userMdl.findOne({"email": username.toLowerCase()}, function(err, user){
            if (err){
                fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                    body: JSON.stringify({"text": err.message}),
                    headers: { 'Content-type': 'application/json', }});
                return done(err);
            }

            if (!user){  // user not found
                return done(null, {"valid": false});
            }

            if (!bcrypt.compareSync(password, user.password)){  // compare password to hash of saved password
                return done(null, {"valid": false});
            } 

            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token

            return done(null, {"valid": true, "user": user, "token": token});
        });
    }
));
