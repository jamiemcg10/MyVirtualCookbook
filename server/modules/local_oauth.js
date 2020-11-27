const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { userMdl } = require('../models/User.js');
const { chapterMdl } = require('../models/Chapter.js');


passport.use(new LocalStrategy({
    // TODO: match to other accounts
    function(email, password, done){
        userMdl.findOne({"email": email}, function(err, user){
            if (err){
                return done(err);
            }

            if (!user){
                return done(null, false);
            }

            if (!user.verifyPassword(password)){
                return done(null, false);
            }

            const token = jwt.sign(userWithEmail.toJSON(), process.env.JWT_SECRET, {expiresIn: '1h'}); // generating token

            return done(null, {"user": user, "token": token});
        });
    }
}));
