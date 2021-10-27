import React, { Component } from 'react';
import Header from '../Components/Header.js';
import googleLogo from '../../Images/g-logo.png';
import facebookLogo from '../../Images/facebook-logo.png'
import { Grid, Paper, TextField, Button } from '@material-ui/core'


class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            emailValue: '',
            passwordValue: '',
            errorText: '',
            error: {
                email: false,
                password: false
            }
        }

        this.emailRef = React.createRef();
        this.loginBtnRef = React.createRef();

        // import modules
        this.md5 = require('md5');  // for hashing password before it is sent to the server
        this.checkInput = require("../modules/checkInput.js");
        this.createRequest = require('../modules/createRequest.js');
        
    }

    componentDidMount(){
        document.addEventListener("keyup", this.hitEnter);
        let emailInput = this.emailRef.current.childNodes[1].childNodes[0];
        emailInput.focus(); // put cursor in email box when page loads
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.hitEnter);
    }

    hitEnter = (event) => {
        if (event.key === "Enter"){
            this.loginBtnRef.current.click(); // click login button
        }
    }
    

    googleLogin = () => { // send to path to redirect through Google
        console.log(process.env.REACT_APP_SITE_ADDRESS)
        window.location=`${process.env.REACT_APP_SITE_ADDRESS}/auth/google`;
    }

    facebookLogin = () => {  // send to path to redirect through Facebook
        window.location=`${process.env.REACT_APP_SITE_ADDRESS}/auth/facebook`;
    }

    // for username/password
    localLogin = () => {
        if (!this.checkInput.isValidEmail(this.state.emailValue)){
            this.setState({
                errorText: "Please enter a valid email address",
                error: {
                    email: true
                }
            })
        } else if (!this.checkInput.isValidPassword(this.state.passwordValue)){
            this.setState({
                errorText: "Please enter a valid password",
                error: {
                    password: true
                }
            })
        } else {
            let md5Password = this.md5(this.state.passwordValue);
            let loginRequest = this.createRequest.createRequestWithBody('/auth/login', 'POST', JSON.stringify({"username": this.state.emailValue,
                                                                                                                "password": md5Password}));
            fetch(loginRequest)
            .then((response)=> {response.json().then((json)=>{
                if (json.success){  // login was successful, redirect to main
                    window.location = `${process.env.REACT_APP_SITE_ADDRESS}/main`;
                } else {
                    this.setState({
                        errorText: 'Your email address or password is incorrect'
                    })
                }
            })}).catch((error)=>{  // login was not successful
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                fetch(logErrorRequest);
                this.setState({
                    errorText: 'An error occured'
                })
            });   
        }
    }


    handleEmailChange = (event) => {
        this.setState({
            emailValue: event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            passwordValue: event.target.value
        });
    }


    render(){
        return (
            <div className="App">
                <Header />
                <h1 className="pageTitle">Log in</h1>
                <Paper 
                    elevation = {10}
                    className="gray-container-box login-container"
                >
                    <h3>Sign in to continue</h3>  
                    <div className="login-box">   
                        <Grid
                            container
                            direction="row"
                            justify="center"
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                className="form-control"
                                id="email"
                                label="Email address"
                                ref={this.emailRef}
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
                            <p className="error">{this.state.errorText}</p>
                            <Button
                                variant="contained"
                                className="form-control btn btn--yellow"
                                ref={this.loginBtnRef}
                                size="large"
                                onClick={ this.localLogin }
                            >
                            Log in
                        </Button>

                        <Button
                            variant="contained"
                            className="form-control btn btn--white"
                            size="small"
                            onClick={ this.googleLogin }
                        >
                            <img src={ googleLogo } alt="Google login"></img><div className="login-btn-text">Sign in with Google</div>
                        </Button>
                        <Button
                            variant="contained"
                            className="form-control"
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

export default Login;