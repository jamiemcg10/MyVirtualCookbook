
import React, { Component } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import './styles/OrganizeIcon.css'

class OrganizeIcon extends Component {
    render(){
        return (
            <div id="oi-container">
                <ListAltIcon
                    id="oi-book"
                ></ListAltIcon>
                    <div id="oi-arrows">
                        <ArrowRightAlt id="oi-up-arrow"></ArrowRightAlt>
                        <ArrowRightAlt id="oi-str-arrow"></ArrowRightAlt>
                        <ArrowRightAlt id="oi-down-arrow"></ArrowRightAlt>
                    </div>
                    <div id="oi-folders">
                        <FolderIcon className="oi-folder"></FolderIcon>
                        <FolderIcon className="oi-folder"></FolderIcon>
                        <FolderIcon className="oi-folder"></FolderIcon>
                    </div>
            </div>
        );
    }
}

export default OrganizeIcon;