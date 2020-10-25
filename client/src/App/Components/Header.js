import React, { Component } from 'react';
import Logo from './Logo.js';

class Header extends Component{
    constructor(props){
        super(props);

        this.state = {
            userLoggedIn: false,
            username: '',
        };

        this.createRequest = require('../modules/createRequest.js');

        let checkLoginRequest = this.createRequest.createRequest("api/user/checklogin", "GET");
        fetch(checkLoginRequest).then(
            (result)=>{
                result.json().then(
                    (json)=>{
                        this.setState({
                            userLoggedIn: json.validUser,
                            username: json.name
                        });
                    })
                });
    }

    render(){
        let nav;
        if (this.state.userLoggedIn) {
            nav = <div>Hi, {this.state.username}! | <a href="./logout" id="logout-link">Log Out</a></div>
        } else {
            nav = <div><a href="./signup" id="signup-link">Sign Up</a> | <a href="./login" id="login-link">Log In</a></div>; 
        }
        return (
            <div className="header">
                <div><Logo /></div>
                { nav }
            </div>
        );
    }

}


export default Header;