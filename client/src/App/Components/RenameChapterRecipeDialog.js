import React, { Component } from "react";
import $ from 'jquery';

class RenameChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newNameValue: this.props.textToModify,
            errorMsg: ''
        };

        console.log(this.props.itemTypeToModify);
        console.log(this.props.textToModify);

        this.createRequest = require('../modules/createRequest.js');

        this.cancelRename = this.cancelRename.bind(this);
        this.changeItem = this.changeItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#chapter-save').trigger("click");
            }
        });
    }

    changeItem(){
        console.log(this.newNameValue);
        if (this.newNameValue === ''){
            // TODO: show message that name can't be blank
            return;
        }

        if (this.newNameValue === this.props.textToModify){  // text is the same
            this.props.showRenameChapterRecipeDialog(false);
            // no need to rerender
        }

        if (this.props.itemTypeToModify === 'chapter'){
            let changeChapterRequest = this.createRequest.createRequest(`/api/chapter/rename/${this.props.textToModify}/${this.state.newNameValue}`, 'PUT');
            fetch(changeChapterRequest).then((response)=>{response.json().then(json => {
                console.log(json);
                if (json.success === true){
                    this.props.showRenameChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {
                    $('#error').text(json.message);
                }
            })})
            .catch(error=>{
                console.log(error);
            });
        
        } else if (this.props.itemTypeToModify === 'recipe'){
            let changeRecipeRequest = this.createRequest.createRequest(`/api/recipe/rename/${this.props.textToModify}/${this.props.recipeChapter}/${this.state.newNameValue}`, 'PUT');
            console.log(changeRecipeRequest);
            console.log(this.props.textToModify);
            console.log(this.props.recipeChapter);
            console.log(this.state.newNameValue);
            fetch(changeRecipeRequest).then((response)=>{response.json().then(json => {
                console.log(json);
                if (json.success === true){
                    this.props.showRenameChapterRecipeDialog(false);
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
                        <input type="text" id="chapter-recipe-name" autofocus value={this.state.newNameValue} onChange={this.handleChange}></input>
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