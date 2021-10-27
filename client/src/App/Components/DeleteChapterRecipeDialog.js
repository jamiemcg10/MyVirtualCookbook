import React, { Component } from "react";
import { Button, ClickAwayListener } from '@material-ui/core';
import './styles/DeleteRenameChapterRecipeDialog.css'

// window to confirm deleting a chapter
class DeleteChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            errorMsg: ''
        };

        // import modules
        this.createRequest = require('../modules/createRequest.js');

        this.saveBtn = React.createRef();
    }

    componentDidMount(){
        // add event listener to click Delete button if user hits enter key
        document.addEventListener("keyup", this.hitEnter);
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.hitEnter);
    }

    hitEnter = (event) => {
        if (event.key === "Enter"){
            this.saveBtn.current.click();
        }
    }

    deleteItem = () => {
        let deleteRequest;

        if (!(this.props.itemTypeToDelete === 'chapter' || this.props.itemTypeToDelete === 'recipe')){
            // there's an error - either a chapter or recipe should have been selected
            this.setState({
                errorMsg: 'Something went wrong. Please try again later.'
            })
            return;
        } else if (this.props.itemTypeToDelete === 'chapter'){ // delete chapter
            deleteRequest = this.createRequest.createRequest(`/api/chapter/delete/${this.props.textToDelete}`, 'DELETE');

        } else if (this.props.itemTypeToDelete === 'recipe'){  // delete recipe
            deleteRequest = this.createRequest.createRequest(`/api/recipe/delete/${this.props.recipeChapter}/${this.props.textToDelete}`, 'DELETE');
        }

        fetch(deleteRequest).then((response)=>{response.json().then(json => {
            if (json.success === true){  // recipe or chapter deleted - close this window and redisplay cookbook
                this.props.showDeleteChapterRecipeDialog(false);
                this.props.rerenderCookbook();
            } else {  // show error
                this.setState({
                    errorMsg: json.message
                })
            }
        })})
        .catch(error=>{  // fetch error
            let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
            fetch(logErrorRequest);
        });

    }


    cancelDelete = () => {
            this.props.showDeleteChapterRecipeDialog(false);
    }


    render(){
        return (
            <div id="dialog-background">
                <ClickAwayListener
                    onClickAway={() => {this.props.showDeleteChapterRecipeDialog(false)}}
                >
                    <div id="delete-dialog" className="dialog">
                        <p className="dialog-title">Delete {this.props.itemTypeToDelete}</p>
                        <div id="delete-box">
                            <br/>
                            <p>Delete {this.props.itemTypeToDelete} {this.props.textToDelete}?</p>
                            {this.props.itemTypeToDelete === 'chapter' && <p className="subtext">All recipes in this chapter will also be deleted</p>}
                            <p className="error" id="error">{this.state.errorMsg}</p>
                        </div>
                        <div className="flex-container chapter-btns">
                            <Button id="delete-save" 
                                ref={this.saveBtn}
                                variant="contained"
                                onClick={this.deleteItem}
                            >
                                Delete
                            </Button>
                            <Button 
                                id="delete-cancel" 
                                variant="contained"
                                onClick={this.cancelDelete}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ClickAwayListener>
            </div>
        );
    }

}


export default DeleteChapterRecipeDialog;