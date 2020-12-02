import React, { Component } from "react";
import $ from 'jquery';

// window to confirm deleting a chapter
class DeleteChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            errorMsg: ''
        };

        this.createRequest = require('../modules/createRequest.js');

        // bind methods
        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount(){
        // add event listener to click Delete button if user hits enter key
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#delete-save').trigger("click");
            }
        });
    }

    deleteItem(){
        if (this.props.itemTypeToDelete === 'chapter'){  // delete chapter
            let deleteChapterRequest = this.createRequest.createRequest(`/api/chapter/delete/${this.props.textToDelete}`, 'DELETE');
            fetch(deleteChapterRequest).then((response)=>{response.json().then(json => {
                if (json.success === true){  // chapter deleted - close this window and redisplay cookbook
                    this.props.showDeleteChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error message
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{  // fetch error
                console.log(error);
            });
        
        } else if (this.props.itemTypeToDelete === 'recipe'){  // delete recipe
            let deleteRecipeRequest = this.createRequest.createRequest(`/api/recipe/delete/${this.props.recipeChapter}/${this.props.textToDelete}`, 'DELETE');
            fetch(deleteRecipeRequest).then((response)=>{response.json().then(json => {
                if (json.success === true){  // recipe deleted - close this window and redisplay cookbook
                    this.props.showDeleteChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{  // fetch error
                console.log(error);
            });
        } else{
            // there's an error - either a chapter or recipe should have been selected
            $('#error').text('Something went wrong. Please try again later.');
        }
    }

    cancelDelete(){
            this.props.showDeleteChapterRecipeDialog(false);
    }


    render(){
        return (
            <div id="dialog-background">
                <div id="delete-dialog" className="dialog">
                    <p className="dialog-title">Delete{this.props.itemTypeToDelete}</p>
                    <div id="rename-box">
                        <br/>
                        <p>Delete {this.props.itemTypeToDelete} {this.props.textToDelete}?</p>
                        {this.props.itemTypeToDelete === 'chapter' && <p class="subtext">All recipes in this chapter will also be deleted</p>}
                        <p className="error" id="error">{this.state.errorMsg}</p>
                    </div>
                    <div className="flex-container chapter-btns">
                        <button id="delete-save" onClick={this.deleteItem}>Delete</button>
                        <button id="delete-cancel" onClick={this.cancelDelete}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

}


export default DeleteChapterRecipeDialog;