import React, { Component } from 'react';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png';
import { Paper, Grid, Button, TextField } from '@material-ui/core';
import './styles/SignupLogin.css';



// error outlines not working

class Signup extends Component { 

    constructor(props){
        super(props);

        this.state = {
            firstName: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorText: '',
            error: {
                firstName: false,
                email: false,
                password: false,
                confirm: false
            }
        }
    
        this.firstNameRef = React.createRef();
        this.signupBtnRef = React.createRef();

        // import modules
        this.md5 = require('md5');
        this.checkInput = require('../modules/checkInput.js');
        this.createRequest = require('../modules/createRequest.js');

    }

    componentDidMount(){
        document.addEventListener("keyup", this.hitEnter);
        let firstNameInput = this.firstNameRef.current.childNodes[1].childNodes[0];
        firstNameInput.focus();  // put cursor in name box on page load
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.hitEnter)
    }

    hitEnter = (event) => {
        if (event.key === "Enter"){
            this.signupBtnRef.current.click();  // click sign-up button
        }
    }

    googleLogin = () => { // send to path to redirect through Google
        window.location=`${process.env.REACT_APP_SITE_ADDRESS}/auth/google`;
    }

    facebookLogin = () => {  // send to path to redirect through Facebook
        window.location=`${process.env.REACT_APP_SITE_ADDRESS}/auth/facebook`;
    }



    localSignup = () => {
        this.setState({
            errorText: ''
        })
        if (!this.checkInput.isValidItemName(this.state.firstName)){
            this.setState({
                errorText: "Please enter a valid name (alphanumeric characters only)",
                error: { 
                    firstName: true
                }
            });
        } else if (!this.checkInput.isValidEmail(this.state.email)){
            this.setState({
                errorText: "Please enter a valid email address",
                error: {
                    email: true
                }
            });
        } else if (!this.checkInput.isValidPassword(this.state.password)){
            this.setState({
                errorText: "Your password must be at least 6 characters and can only contain alphanumeric characters",
                error: {
                    password: true
                }
            });
        } else if (this.state.password !== this.state.confirmPassword){
            this.setState({
                errorText: "Passwords must match",
                error: {
                    confirm: true
                }
            });
        } else {
            let md5Password = this.md5(this.state.password);  // hash password before sending
            let newUserRequest = this.createRequest.createRequestWithBody('/api/signup', 'POST', JSON.stringify({ "firstName": this.state.firstName,
                                                                                       "email": this.state.email,
                                                                                        "password": md5Password}));
            fetch(newUserRequest).then((response) => response.json().then((json) => {
                if (json.success){  // signup successful - redirect to main
                    window.location=`${process.env.REACT_APP_SITE_ADDRESS}/main`;
                } else {
                    this.setState({
                        errorText: json.message
                    })
                }
            })).catch((error) => {
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                fetch(logErrorRequest);
                this.setState({
                    errorText: "An error occured"
                })
            });
        } 
    }

    handleFirstNameChange = (event) => {
        this.setState({
            firstName: event.target.value
        });
    }

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    handleConfirmPasswordChange = (event) => {
        this.setState({
            confirmPassword: event.target.value
        });
    }

    render(){
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Sign up</h1>
                <Paper 
                    className="gray-container-box signup-container"
                    elevation={10} 
                >
                    <h3>Create an account</h3>   
                    <div className="signup-box">   
                        <Grid
                            container
                            direction="row"
                            justify="center"
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                className="form-control"
                                id="name"
                                label="First name"
                                ref={this.firstNameRef}
                                value={this.state.firstName}
                                onChange={this.handleFirstNameChange}
                                error={this.state.error.firstName}
                            >
                            </TextField>
                            <TextField
                                variant="outlined"
                                size="small"
                                className="form-control"
                                id="email"
                                label="Email address"
                                onChange={this.handleEmailChange}
                                error={this.state.error.email}
                            >
                            </TextField>
                            <TextField
                                variant="outlined"
                                size="small"
                                className="form-control"
                                id="password"
                                label="Password"
                                type="password"
                                onChange={this.handlePasswordChange}
                                error={this.state.error.password}
                            >
                            </TextField>
                            <TextField
                                variant="outlined"
                                size="small"
                                className="form-control"
                                id="confirm-password"
                                label="Confirm password"
                                type="password"
                                onChange={this.handleConfirmPasswordChange}
                                error={this.state.error.confirm}
                            >
                            </TextField>
                            <p className="error">{this.state.errorText}</p>
                            <Button
                                variant="contained"
                                className="form-control btn btn--white"
                                id="sign-up-btn"
                                ref={this.signupBtnRef}
                                size="large"
                                onClick={ this.localSignup }
                            >
                                Sign Up
                            </Button>

                            <Button
                                variant="contained"
                                className="form-control btn btn--white"
                                id="google-btn"
                                size="small"
                                onClick={ this.googleLogin }
                            >
                                <img src={ googleLogo } alt="Google login"></img><div className="login-btn-text">Sign in with Google</div>
                            </Button>
                            <Button
                                variant="contained"
                                className="form-control btn"
                                id="facebook-btn"
                                onClick={ this.facebookLogin }
                            >
                            <img src={ facebookLogo } alt="Facebook login"></img><div className="login-btn-text">Login with Facebook</div>
                            </Button>
                        </Grid>
                    </div> 

                </Paper>
            </div>
        );
    }
}

export default Signup;