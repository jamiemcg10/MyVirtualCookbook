import React, { Component } from 'react';
import Logo from '../Components/Logo.js';
import Tile from '../Components/Tile.js';

// /home
class Home extends Component {

    render(){
        return (
            <div className="App">
                <div className="mainPageLogo"><Logo /></div>
                <div className="tile-box flex-container">
                    <Tile title="Organize"/>
                    <Tile title="Add recipes"/>
                    <Tile title="Take notes"/>
                </div>
                <div id="learnMoreLinkContainer">
                    <a id="learnMoreLink" href={'./about'}>Learn more</a><br/>
                </div>
                <div className="flex-container">
                    <a href={'./signup'}><button id="signup-btn" className="homeButton">Sign up</button></a>
                    <a href={'./login'}><button id="login-btn" className="homeButton">Log in</button></a>
                </div>
            </div>
        );
    }
}

export default Home;