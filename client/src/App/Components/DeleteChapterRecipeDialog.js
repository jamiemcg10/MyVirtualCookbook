import React, { Component } from "react";
import $ from 'jquery';

class DeleteChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            errorMsg: ''
        };

        console.log(this.props.itemTypeToDelete);
        console.log(this.props.textToDelete);

        this.createRequest = require('../modules/createRequest.js');

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount(){
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#chapter-save').trigger("click");
            }
        });
    }

    deleteItem(){
        console.log(this.newNameValue);
        if (this.newNameValue === ''){
            // TODO: show message that name can't be blank
            return;
        }

        if (this.props.itemTypeToDelete === 'chapter'){
            console.log(`${this.props.textToDelete}`);
            let deleteChapterRequest = this.createRequest.createRequest(`/api/chapter/delete/${this.props.textToDelete}`, 'DELETE');
            fetch(deleteChapterRequest).then((response)=>{response.json().then(json => {
                console.log(json);
                if (json.success === true){
                this.props.showDeleteChapterRecipeDialog(false);
                this.props.rerenderCookbook();
                } else {
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{
                console.log(error);
            });
        
        } else if (this.props.itemTypeToDelete === 'recipe'){
            let deleteRecipeRequest = this.createRequest.createRequest(`/api/recipe/delete/${this.props.recipeChapter}/${this.props.textToDelete}`, 'DELETE');
            fetch(deleteRecipeRequest).then((response)=>{response.json().then(json => {
                console.log(json);
                if (json.success === true){
                    this.props.showDeleteChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{
                console.log(error);
            });
        } else{
            // there's an error
        }
    }

    cancelDelete(){
            this.props.showDeleteChapterRecipeDialog(false);

    }


    render(){
        return (
            <div id="dialog-background">
                <div id="delete-dialog" className="dialog">
                    <p className="dialog-title">Delete {this.props.itemTypeToDelete}</p>
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