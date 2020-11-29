const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');
const bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

passport.use(new LocalStrategy(
    // TODO: match to other accounts
    // TODO: ignore email case
    function(username, password, done){
        console.log(username);
        console.log(password);
        console.log("in local passport");
        userMdl.findOne({"email": username.toLowerCase()}, function(err, user){
            if (err){
                console.log(err);
                return done(err);
            }

            if (!user){
                console.log("no user");
                return done(null, false);
            }

            console.log(password);
            console.log(user.password);
            console.log(bcrypt.hashSync(password, 8));
            if (!bcrypt.compareSync(password, user.password)){
                console.log("password invalid");
                return done(null, false);
            } 

            console.log("password is valid");
            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token

            console.log("token generated in local strat");
            return done(null, {"user": user, "token": token});
        });
    }
));
