import React, { Component } from 'react';
import { MenuList, MenuItem, Paper, ClickAwayListener } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import './styles/CustomContextMenu.css'

// renders right click menu for cookbook
class CustomContextMenu extends Component {


render(){
    return(
        <Paper
            id="menu"
        >
            <ClickAwayListener onClickAway={ ()=>{this.props.showContextMenu(false)} }>
                <MenuList>
                    <MenuItem
                        className="menu"
                        onClick={ ()=>{this.props.showContextMenu(false); this.props.renameItem(true);} }
                    >
                        <EditIcon fontSize="small"></EditIcon>
                        &nbsp;Rename
                    </MenuItem>
                    <MenuItem
                        className="menu"
                        onClick={ ()=>{this.props.showContextMenu(false); this.props.deleteItem(true);} }
                    >
                        <DeleteIcon fontSize="small"></DeleteIcon>
                        &nbsp;Delete
                    </MenuItem>
                </MenuList>
            </ClickAwayListener>
        </Paper>

    );
};


}  // end CustomContextMenu class


export default CustomContextMenu;