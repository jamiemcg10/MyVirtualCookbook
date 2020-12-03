const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config(); // for using environment variables
const createRequest = require('../../client/src/App/modules/createRequest');

// check token for routes
function checkToken(req, res, next){  
    console.log("checking token");
    let token = req.session.data.token;

    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if (err){
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: err}));
                fetch(logErrorRequest);
                //console.log(err);
                res.redirect("/login");
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

// redirect to /main if user is logged in
function redirectToMain(req, res, next){ 
    let token = req.session.data.token;

    if(token){  // there is a token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err){
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: err}));
                fetch(logErrorRequest);
                next();  // continue
            } else { // has valid token
                res.redirect("/main");
            }
        });
    } else { // there is no token
        next();  // continue
    }
}

module.exports = {
    checkToken: checkToken,
    redirectToMain: redirectToMain,
};