import React, { Component } from "react";
import $ from 'jquery';

class AddChapterDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            chapterNameValue: '',
            errorMsg: ''
        };

        this.createRequest = require('../modules/createRequest.js');
        console.log(`createRequest: ${this.createRequest.createRequest}`);

        this.cancelChapterAdd = this.cancelChapterAdd.bind(this);
        this.addChapter = this.addChapter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        console.log($('#chapter-save'));
        $().on("keyup", (event)=>{
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
            console.log(newChapterText);
            if (newChapterText === ""){
                return;
            } else {
                let newChapterRequest =this.createRequest.createRequest(`http://localhost:5000/api/chapter/${newChapterText}`, 'POST');
                fetch(newChapterRequest).then(
                    (response) => {response.json().then((json) => {
                        console.log(json);
                        if (json.success){
                            this.props.showAddChapterDialog(false);
                            this.props.rerenderCookbook();
                        } else {
                            this.setState({
                                errorMsg: json.message
                            });

                        }

                    })}
                );

            }
   
    }

    cancelChapterAdd(){
            this.props.showAddChapterDialog(false);

    }

    handleChange(event){
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
                        <input type="text" id="chapter-name" autofocus value={this.state.value} onChange={this.handleChange}></input>
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