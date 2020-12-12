import React, {Component} from 'react';
import Header from '../Components/Header.js';

class HowItWorks extends Component{

    render(){
        return(
            <div className = "App">
                <Header />
                <h1 className="pageTitle">How it works</h1>
                <ol>
                    <li>Sign up for an account. You can create an account using your email address and a password you create or using your Gmail account</li>
                    <li>Add recipes to your chapters in your virtual cookbook. You can create as many chapters as you need and re-name them whenever you want</li>
                    <li>You can drag and drop recipes from one chapter to another. It’s your cookbook! You can decide how your recipes will be organized</li>
                    <li>There are notes attached to each recipe. You can access them from the table of contents or from each recipe page. You can add notes on what works, what doesn’t work, what you changed, or whatever you want!</li>
                    <li>Your recipes will automatically open in a new tab. A separate window will pop-up for your notes</li>
                    {/* <li>Some recipes will automatically open in a new tab. When this happens, a separate window will pop-up for your notes</li> */}
                </ol>
            </div>
        );
    }
}

export default HowItWorks;