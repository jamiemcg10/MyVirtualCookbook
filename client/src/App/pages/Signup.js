import React, { Component } from 'react';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png'

class Signup extends Component {  // to implement custom sign-up later

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
                <h1 className="pageTitle">Sign up</h1>
                <div className="gray-login-box">
                    <h3>Create an account</h3>                    
                    <div className="social-btn-box">
                        <h3 id="divider">______________________________________________</h3>
                        <button className="social-login-btn" id="google-btn" onClick={ this.googleLogin.bind(this) }><img src={ googleLogo } alt="Google login"></img><div className="login-btn-text">Sign in with Google</div></button> 
                        <button className="social-login-btn" id="facebook-btn" onClick={ this.facebookLogin.bind(this) }><img src={ facebookLogo } alt="Facebook login"></img><div className="login-btn-text">Login with Facebook</div></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;