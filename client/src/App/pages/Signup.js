import React, { Component } from 'react';
import $ from 'jquery';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png';

class Signup extends Component { 

    constructor(props){
        super(props);

        this.state = {
            firstName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
        
        this.createRequest = require('../modules/createRequest.js');

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    }

    googleLogin(){ // send to path to redirect through Google
        window.location="http://localhost:5000/auth/google";
    }

    facebookLogin(){  // send to path to redirect through Facebook
        window.location="http://localhost:5000/auth/facebook";
    }

    isValidEmail(email){
        if (email.indexOf(".") > email.indexOf("@") && (email.indexOf(".") > -1 && email.indexOf("@") >-1)){
            return true;
        }

        return false;
    }

    localLogin(){
        if (this.state.firstName !== '' && this.isValidEmail(this.state.email) && this.state.password !== '' && (this.state.password === this.state.confirmPassword)){
            let newUserRequest = this.createRequest.createRequestWithBody('/api/signup', 'POST', { "firstName": this.state.firstName,
                                                                                        "email": this.state.email,
                                                                                        "password": this.state.password});
            fetch(newUserRequest).then(
                (response)=>{response.json().then((json)=>{
                    console.log(json);
                })}
            ).catch((error) => {
                console.log(error);
            });
        }
        // '/login'
    }

    handleFirstNameChange(event){
        this.setState({
            firstName: event.target.value
        });
    }

    handleEmailChange(event){
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        });
    }

    handleConfirmPasswordChange(event){
        this.setState({
            confirmPassword: event.target.value
        });
    }

    render(){
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Sign up</h1>
                <div className="gray-login-box">
                    <h3>Create an account</h3>   
                    <div className="signup-box">      
                        <label for="name">First name</label><input type="text" id="name" value={ this.state.firstName } onChange={this.handleFirstNameChange}></input>
                        <label for="email">Email address</label><input type="text" id="email" value={ this.state.email } onChange={this.handleEmailChange}></input>          
                        <label for="password">Choose a password</label><input type="password" id="password" value={ this.state.password } onChange={this.handlePasswordChange}></input>
                        <label for="confirm-password">Confirm password</label><input type="password" id="confirm-password" value={ this.state.confirmPassword } onChange={this.handleConfirmPasswordChange}></input>
                        <div id="sign-up-btn" onClick={ this.localLogin.bind(this) }>Sign up</div>
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

export default Signup;