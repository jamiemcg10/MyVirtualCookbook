import React, { Component } from 'react';
import Logo from '../Components/Logo.js';
import OrganizeIcon from '../Components/Icons/OrganizeIcon.js';
import TakeNotesIcon from '../Components/Icons/TakeNotesIcon.js';
import AddRecipeIcon from '../Components/Icons/AddRecipeIcon.js';
import { Button, Card } from '@material-ui/core';
import './styles/Home.css';

// /home
class Home extends Component {

    render(){
        return (
            <div className="App">
                <div className="mainPageLogo"><Logo /></div>
                <div className="tile-box flex-container">
                    <Card className="tile">
                        <AddRecipeIcon></AddRecipeIcon>
                        Add recipes
                    </Card>
                    <Card className="tile">
                        <OrganizeIcon></OrganizeIcon>
                        Organize
                    </Card>
                    <Card className="tile">
                        <TakeNotesIcon></TakeNotesIcon>
                        Take notes
                    </Card>
                </div>
                <div className="flex-container home-btn-box">
                <a href={'./about'}>
                        <Button
                            id="learn-more-btn"
                            className="btn btn--home btn--green"
                            variant="contained"
                        >
                            Learn more
                        </Button>
                    </a>
                    <a href={'./signup'}>
                        <Button
                            id="signup-btn" 
                            className="btn btn--home btn--white"
                            variant="contained"
                        >
                            Sign up
                        </Button>
                    </a>
                    <a href={'./login'}>
                        <Button
                            id="login-btn" 
                            className="btn btn--home btn--yellow"
                            variant="contained"
                        >
                            Log in
                        </Button>
                    </a>
                </div>
            </div>
        );
    }
}

export default Home;