import React, { Component } from 'react';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png'

class Login extends Component {

    googleLogin(){ // send to path to redirect through Google
        window.location="http://localhost:5000/auth/google";
    }

    facebookLogin(){  // send to path to redirect through Facebook
        window.location="http://localhost:5000/auth/facebook";
    }

    render(){
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Log in</h1>
                <div className="gray-login-box">
                    <h3>Sign in to continue</h3>    
                    <div className="login-box">      
                        <label for="email">Email address</label><input type="text" id="email"></input>          
                        <label for="password">Password</label><input type="password" id="password"></input>
                        <div id="log-in-btn">Log in</div>
                    </div>                 
                    <div className="social-btn-box">
                        <hr id="divider"></hr>
                        <button className="social-login-btn" id="google-btn" onClick={ this.googleLogin.bind(this) }><img src={ googleLogo } alt="Google login"></img><div className="login-btn-text">Sign in with Google</div></button> 
                        <button className="social-login-btn" id="facebook-btn" onClick={ this.facebookLogin.bind(this) }><img src={ facebookLogo } alt="Facebook login"></img><div className="login-btn-text">Login with Facebook</div></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;