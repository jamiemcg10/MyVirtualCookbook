import React, { Component } from 'react';
import Logo from './Logo.js';

class Header extends Component{

    render(){
        return (
            <div className="header">
                <div><Logo /></div><div><a href="./signup" id="signup-link">Sign Up</a> | <a href="./login" id="login-link">Log In</a></div>
            </div>
        );
    }

}


export default Header;