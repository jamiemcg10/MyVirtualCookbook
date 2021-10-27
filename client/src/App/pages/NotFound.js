import React, { Component } from 'react';
import './styles/NotFound.css'

// show for invalid route
class NotFound extends Component {

    render(){
        return (
            <div className="App">
                <span id="not-found">Looks like that page is missing!</span>
            </div>
        );
    }
}

export default NotFound;