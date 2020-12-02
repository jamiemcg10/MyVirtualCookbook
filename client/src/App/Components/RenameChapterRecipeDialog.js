import React, { Component } from "react";
import $ from 'jquery';

// dialog window to rename an existing chapter
class RenameChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newNameValue: this.props.textToModify,
            errorMsg: ''
        };


        this.createRequest = require('../modules/createRequest.js');

        // bind methods
        this.cancelRename = this.cancelRename.bind(this);
        this.changeItem = this.changeItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        $().on("keyup", (event)=>{  // click rename button if user hits enter
            if (event.key === "Enter"){
                $('#rename-save').trigger("click");
            }
        });
        $('#chapter-recipe-name').trigger('focus');  // put cursor in chapter name box when component loads
    }

    changeItem(){
        $('#error').text('');  // reset error text
        if (this.newNameValue === ''){  // chapter can't be blank
            $('#error').text('The chapter name can\'t be blank');
            return;
        }

        if (this.newNameValue === this.props.textToModify){  // text is the same
            this.props.showRenameChapterRecipeDialog(false);
            // no need to rerender
            return;
        }

        if (this.props.itemTypeToModify === 'chapter'){  // rename chapter
            let changeChapterRequest = this.createRequest.createRequest(`/api/chapter/rename/${this.props.textToModify}/${this.state.newNameValue}`, 'PUT');
            fetch(changeChapterRequest).then((response)=>{response.json().then(json => {
                if (json.success === true){  // rename was successful - close dialog and redisplay cookbook
                    this.props.showRenameChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{
                console.log(error);
            });
        
        } else if (this.props.itemTypeToModify === 'recipe'){  // rename recipe
            let changeRecipeRequest = this.createRequest.createRequest(`/api/recipe/rename/${this.props.textToModify}/${this.props.recipeChapter}/${this.state.newNameValue}`, 'PUT');
            fetch(changeRecipeRequest).then((response)=>{response.json().then(json => {
                if (json.success === true){  // rename was successful - close dialog and redisplay cookbook
                    this.props.showRenameChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{
                $('#error').text('Sorry, something went wrong. Please try again later.');
                console.log(error);
            });
        } else{
            // there's an error - either a chapter or recipe should have been selected
            $('#error').text('Sorry, something went wrong. Please try again later.');
        }
    }

    cancelRename(){
            this.props.showRenameChapterRecipeDialog(false);

    }

    handleChange(event){
        this.setState({
            newNameValue: event.target.value,
        });
    }

    render(){
        return (
            <div id="dialog-background">
                <div id="rename-dialog" className="dialog">
                    <p className="dialog-title">Rename {this.props.itemTypeToModify}</p>
                    <div id="rename-box">
                        <label for="chapter-recipe-name">New name:</label>
                        <br/>
                        <input type="text" id="chapter-recipe-name" value={this.state.newNameValue} onChange={this.handleChange}></input>
                        <p className="error" id="error">{this.state.errorMsg}</p>
                    </div>
                    <div className="flex-container chapter-btns">
                        <button id="rename-save" onClick={this.changeItem}>Rename</button>
                        <button id="rename-cancel" onClick={this.cancelRename}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

}


export default RenameChapterRecipeDialog;