import React, { Component } from 'react';
import Header from '../Components/Header.js';
import $ from 'jquery';
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

        this.md5 = require('md5');
        
        this.createRequest = require('../modules/createRequest.js');

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.localSignup = this.localSignup.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.facebookLogin = this.facebookLogin.bind(this);
    }

    componentDidMount(){
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#sign-up-btn').trigger("click");
            }
        });
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

    localSignup(){
        if (this.state.firstName === ''){
            $('#error').text("You must enter a first name");
        } else if (!this.isValidEmail(this.state.email)){
            $('#error').text("Please enter a valid email address");
        } else if (this.state.password === ''){
            $('#error').text("Please enter a password");
        } else if (this.state.password !== this.state.confirmPassword){
            $('#error').text("Passwords must match");
        } else if (this.state.firstName !== '' && this.isValidEmail(this.state.email) && this.state.password !== '' && (this.state.password === this.state.confirmPassword)){
            let md5Password = this.md5(this.state.password);
            let newUserRequest = this.createRequest.createRequestWithBody('/api/signup', 'POST', JSON.stringify({ "firstName": this.state.firstName,
                                                                                       "email": this.state.email,
                                                                                        "password": md5Password}));
            fetch(newUserRequest).then((response) => response.json().then((json) => {
                if (json.success){
                    window.location="http://localhost:5000/main";
                }
            })).catch((error) => {
                console.log(error);
            });
        } else {
            $('#error').text("An error occured");
        }
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
        // TODO: OBSCURE PASSWORD IN CONSOLE - VALUE
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Sign up</h1>
                <div className="gray-signup-box">
                    <h3>Create an account</h3>   
                    <div className="signup-box">      
                        <label for="name">First name</label><input type="text" id="name" autofocus value={ this.state.firstName } onChange={this.handleFirstNameChange}></input>
                        <label for="email">Email address</label><input type="text" id="email" value={ this.state.email } onChange={this.handleEmailChange}></input>          
                        <label for="password">Choose a password</label><input type="password" id="password" value={ this.state.password } onChange={this.handlePasswordChange}></input>
                        <label for="confirm-password">Confirm password</label><input type="password" id="confirm-password" value={ this.state.confirmPassword } onChange={this.handleConfirmPasswordChange}></input>
                        <p id="error" className="error"></p>
                        <button id="sign-up-btn" onClick={ this.localSignup }>Sign up</button>
                    </div> 
                    <div className="social-btn-box">
                        <hr id="divider"></hr>
                        <button className="social-login-btn" id="google-btn" onClick={ this.googleLogin }><img src={ googleLogo } alt="Google login"></img><div className="login-btn-text">Sign in with Google</div></button> 
                        <button className="social-login-btn" id="facebook-btn" onClick={ this.facebookLogin }><img src={ facebookLogo } alt="Facebook login"></img><div className="login-btn-text">Login with Facebook</div></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;