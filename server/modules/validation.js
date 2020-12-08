const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config(); // for using environment variables

// check token for routes
function checkToken(req, res, next){ 
    let token;
    token = req.session.data.token || '';

    if (token){ // there is a token - check it
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if (err){
                fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                                        body: JSON.stringify({text: err.message}),
                                        headers: { 'Content-type': 'application/json', }});
                res.redirect("/login");
            } else { // token is valid
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
    let token;
    token = req.session.data.token || '';

    if(token){  // there is a token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err){
                fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                                                                body: JSON.stringify({text: err.message}),
                                                                headers: { 'Content-type': 'application/json', }});
                next();  // continue
            } else { // has valid token
                res.redirect("/main");
            }
        });
    } else { // there is no token
        next();  // continue
    }
}

// make sure page is in cookbook
function isValidPage(req, res, next){
    let chapterName = req.params.chapter;
    let recipeName = req.params.recipeName;
    fetch(`${process.env.SITE_ADDRESS}/api/checkPage/${chapterName}/${recipeName}`, {method: 'POST', 
                                                                                    body: JSON.stringify({"userid": req.session.data.userid}),
                                                                                    headers: { 'Content-type': 'application/json', }})
        .then((response) => {response.json()
        .then((json) => {
            if (json.valid){
                next();
            } else {
                res.end();
            }
        })})
        .catch((error)=>{
            fetch(`${process.env.SITE_ADDRESS}/api/log`, {method: 'POST', 
                                                            body: JSON.stringify({text: error.message}),
                                                            headers: { 'Content-type': 'application/json', }});
            res.end();
        });
}

module.exports = {
    checkToken: checkToken,
    redirectToMain: redirectToMain,
    isValidPage: isValidPage
};