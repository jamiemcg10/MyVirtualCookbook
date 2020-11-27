import React, { Component } from "react";
import $ from 'jquery';

class AddChapterDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newNameValue: '',
            errorMsg: ''
        };

        this.createRequest = require('../modules/createRequest.js');

        this.cancelRename = this.cancelRename.bind(this);
        this.changeChapter = this.changeChapter.bind(this);
        this.changeRecipe = this.changeRecipe.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        $().on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#chapter-save').trigger("click");
            }
        });
    }



    cancelRename(){
            this.props.showAddChapterDialog(false);

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
                    <p className="dialog-title">Rename {" chapter or recipe"}</p>
                    <div id="rename-box">
                        <label for="chapter-recipe-name">New name:</label>
                        <br/>
                        <input type="text" id="chapter-recipe-name" autofocus value={this.state.newNameValue} onChange={this.handleChange}></input>
                        <p className="error" id="error">{this.state.errorMsg}</p>
                    </div>
                    <div className="flex-container chapter-btns">
                        <button id="rename-save" onClick={this.addChapter}>Save</button>
                        <button id="rename-cancel" onClick={this.cancelRename}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

}


export default AddChapterDialog;