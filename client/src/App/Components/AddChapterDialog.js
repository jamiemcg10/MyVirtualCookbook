import React, { Component } from "react";
import $ from 'jquery';


// window for adding a chapter to the cookbook
class AddChapterDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            chapterNameValue: '',
            errorMsg: ''
        };

        this.createRequest = require('../modules/createRequest.js');

        // bind methods
        this.cancelChapterAdd = this.cancelChapterAdd.bind(this);
        this.addChapter = this.addChapter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        $('#chapter-name').trigger("focus");  // put cursor in textbox
        $().on("keyup", (event)=>{  // save chapter if user clicks enter
            if (event.key === "Enter"){
                $('#chapter-save').trigger("click");
            }
        });
    }

    addChapter(){
            this.setState({
                errorMsg: ''
            });

            let newChapterText = this.state.chapterNameValue;
            if (newChapterText === ""){  // don't allow blank chapter names
                return;
            } else {
                let newChapterRequest =this.createRequest.createRequest(`http://localhost:5000/api/chapter/add/${newChapterText}`, 'POST');
                fetch(newChapterRequest).then(
                    (response) => {response.json().then((json) => {
                        if (json.success){
                            this.props.showAddChapterDialog(false);
                            this.props.rerenderCookbook();
                        } else {
                            this.setState({
                                errorMsg: json.message
                            });

                        }

                    })}
                ).catch(error=>{
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: error}));
                    fetch(logErrorRequest);
                });

            }
   
    }

    cancelChapterAdd(){
            this.props.showAddChapterDialog(false);
    }

    handleChange(event){  // change value of chapter name textbox
        this.setState({
            chapterNameValue: event.target.value,
        });
    }

    render(){
        return (
            <div id="dialog-background">
                <div id="add-chapter-dialog" className="dialog">
                    <p className="dialog-title">Add chapter</p>
                    <div id="chapter-name-box">
                        <label for="chapter-name">Chapter name:</label>
                        <br/>
                        <input type="text" id="chapter-name" value={this.state.value} onChange={this.handleChange}></input>
                        <p className="error" id="error">{this.state.errorMsg}</p>
                    </div>
                    <div className="flex-container chapter-btns">
                        <button id="chapter-save" onClick={this.addChapter}>Save</button>
                        <button id="chapter-cancel" onClick={this.cancelChapterAdd}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

}


export default AddChapterDialog;