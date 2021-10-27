
import React, { Component } from 'react';
import CreateIcon from '@material-ui/icons/Create'
import ListAltIcon from '@material-ui/icons/ListAlt';
import './styles/TakeNotesIcon.css'

class TakeNotesIcon extends Component {
    render(){
        return (
            <div id="tni-container">
                <ListAltIcon id="tni-paper"></ListAltIcon>
                <CreateIcon id="tni-pencil"></CreateIcon>
            </div>
        );
    }
}

export default TakeNotesIcon;