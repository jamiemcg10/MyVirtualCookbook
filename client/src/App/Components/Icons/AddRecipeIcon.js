
import React, { Component } from 'react';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/Add';
import './styles/AddRecipeIcon.css'

class AddRecipeIcon extends Component {
    render(){
        return (
            <div id="ari-container">
                <ListAltIcon id="ari-paper"></ListAltIcon>
                <AddIcon id="ari-add"></AddIcon>
            </div>
        );
    }
}

export default AddRecipeIcon;