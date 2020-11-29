import React, { Component } from 'react';
import $ from 'jquery';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png'

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            emailValue: '',
            passwordValue: ''
        }

        this.md5 = require('md5');
        this.createRequest = require('../modules/createRequest.js');
        
        this.googleLogin = this.googleLogin.bind(this);
        this.facebookLogin = this.facebookLogin.bind(this);
        this.localLogin = this.localLogin.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    componentDidMount(){
        $('#email').trigger("focus");
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#log-in-btn').trigger("click");
            }
        });
    }
    

    googleLogin(){ // send to path to redirect through Google
        window.location="http://localhost:5000/auth/google";
    }

    facebookLogin(){  // send to path to redirect through Facebook
        window.location="http://localhost:5000/auth/facebook";
    }

    localLogin(){
        if (this.state.emailValue === ''){
            $('#error').text("Please enter your email address");
        } else if (this.state.passwordValue === ''){
            $('#error').text("Please enter your password");
        } else {
            let md5Password = this.md5(this.state.passwordValue);
            let loginRequest = this.createRequest.createRequestWithBody('/auth/login', 'POST', JSON.stringify({"username": this.state.emailValue,
                                                                                                                "password": md5Password}));
            fetch(loginRequest)
            .then((response)=> {response.json().then((json)=>{
                console.log(json);
                if (json.success){
                    window.location = 'http://localhost:5000/main';
                }
            })}).catch((error)=>{
                console.log(error);
                $('#error').text("An error occured");
            });   
        }
    }


    handleEmailChange(event){
        this.setState({
            emailValue: event.target.value
        });
    }

    handlePasswordChange(event){
        this.setState({
            passwordValue: event.target.value
        });
    }


    render(){
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Log in</h1>
                <div className="gray-login-box">
                    <h3>Sign in to continue</h3>    
                    <div className="login-box">  
                        <label for="email">Email address</label><input type="text" id="email" name="username" value={this.state.emailValue} onChange={ this.handleEmailChange }></input>          
                        <label for="password">Password</label><input type="password" id="password" name="password" value = {this.state.passwordValue} onChange={ this.handlePasswordChange }></input>
                        <p id="error" className="error"></p>
                        <button id="log-in-btn" onClick={ this.localLogin }>Log in</button>
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

export default Login;