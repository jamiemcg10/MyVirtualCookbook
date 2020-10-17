import React, {Component} from 'react';
import Header from '../Components/Header.js';

class HowItWorks extends Component{

    render(){
        return(
            <div className = "App">
                <Header />
                <h1 className="pageTitle">How it works</h1>
                <ol>
                    <li>Sign up for an account using your Gmail or Facebook account</li>
                    <li>Add recipes to your virtual cookbook. You can do this by adding links to webpages or by uploading pictures or recipes</li>
                    <li>You can organize your recipes into different chapters. We have some suggested chapters for you, but it’s your cookbook! You can decide how your recipes will be organized</li>
                    <li>Each page of your cookbook will have a section for you to add notes on what works, what doesn’t work, what you changed, or whatever you want!</li>
                </ol>
            </div>
        );
    }
}

export default HowItWorks;