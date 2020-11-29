const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config(); // for using environment variables


function checkToken(req, res, next){  
    console.log("checking token");
    let token = req.session.data.token;

    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if (err){
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else { // token is valid
                console.log("token is valid");
                req.decoded = decoded;
                next();
            }
        });
    } else {  // there is no token
        res.redirect("/login");
    }
}

function redirectToMain(req, res, next){ 
    let token = req.session.data.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err){
                next();
            } else { // has valid token
                res.redirect("/main");
            }
        });
    } else { // there is no token
        next();
    }
}

module.exports = {
    checkToken: checkToken,
    redirectToMain: redirectToMain,
};