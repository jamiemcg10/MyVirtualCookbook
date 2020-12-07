import React, { Component } from 'react';
import Logo from './Logo.js';

// display header
class Header extends Component{
    constructor(props){
        super(props);

        this.state = {
            userLoggedIn: false,
            username: '',
            type: this.props.type || "header"
        };

        

        this.createRequest = require('../modules/createRequest.js');

        let checkLoginRequest = this.createRequest.createRequest("/api/user/checklogin", "GET");
        fetch(checkLoginRequest).then(
            (response)=>{
                response.json().then(
                    (json)=>{
                        this.setState({
                            userLoggedIn: json.validUser,
                            username: json.name
                        });
                    })
                }).catch((error)=>{
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                    fetch(logErrorRequest);
                });
    }

    render(){
        // let nav;
        // if (this.state.userLoggedIn) {  // if user is logged in, show greeting and link to log out
        //     nav = <div>Hi, {this.state.username}! | <a href="./logout" id="logout-link">Log Out</a></div>
        // } else {  // user is not logged in - show options to sign up or login
        //     nav = <div><a href="./signup" id="signup-link">Sign Up</a> | <a href="./login" id="login-link">Log In</a></div>; 
        // }
        // return (
        //     <div className={ this.state.type }>
        //         <div><Logo /></div>
        //         { !this.props.type && nav }
        //     </div>
        // );

        if (this.state.userLoggedIn) {  // if user is logged in, show greeting and link to log out
            return (
                <div className={ this.state.type }>
                    <div><a id="logo-link" href={'./main'}><Logo /></a></div>
                    <div>Hi, {this.state.username}! | <a href="./logout" id="logout-link">Log Out</a></div>
                </div>
            );
        } else {  // user is not logged in - show options to sign up or login
            return (
                <div className={ this.state.type }>
                    <div><a id="logo-link" href={'./'}><Logo /></a></div>
                    <div><a href="./signup" id="signup-link">Sign Up</a> | <a href="./login" id="login-link">Log In</a></div> 
                </div>
            );
        }
    }

}


export default Header;