import React, { Component } from "react";
import './styles/CookiePopupWarning.css'

class CookiePopupWarning extends Component {
    constructor(props){
        super(props);

        this.state = {
            warningAccepted: false,
        };

        // import module
        this.createRequest = require('../modules/createRequest.js');
    }


    acceptWarning = () => {
            let acceptCookieRequest = this.createRequest.createRequest(`/api/acceptCookies`, "POST");
            fetch(acceptCookieRequest)
                .catch(error=>{
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                        fetch(logErrorRequest);
                });
            this.props.showCookiePopupWarning(false);
            this.props.acceptCookies(true);
    }


    render(){     
        return(
            <div class="cookie-popup-warning">
                <div class="btn--close close-cookie-popup-warning" onClick={ ()=>{this.acceptWarning()}}>&times;</div>
                <div class="cookie-popup-warning-text">This website uses cookies and pop-up windows to function properly. By continuing to use this site, you acknowledge 
                that you accept the use of cookies. If your browser blocks pop-up windows, this site may not function properly. 
                Please allow pop-ups from this site. We promise to not show pop-up advertisements.</div>
            </div>
        );
    }

}

export default CookiePopupWarning;