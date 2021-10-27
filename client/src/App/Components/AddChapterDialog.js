import React, { Component } from "react";
import { Button, TextField, ClickAwayListener } from '@material-ui/core'
import './styles/AddChapterRecipeDialog.css'


// window for adding a chapter to the cookbook
class AddChapterDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            chapterNameValue: '',
            errorMsg: ''
        };

        // import modules
        this.checkInput = require('../modules/checkInput.js');
        this.createRequest = require('../modules/createRequest.js');

        this.saveBtn = React.createRef();
        this.chapterName = React.createRef();
    }

    componentDidMount(){
        let chapterNameInput = this.chapterName.current.childNodes[1].childNodes[0];
        chapterNameInput.focus()
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

    addChapter = () => {
            this.setState({
                errorMsg: ''
            });

            let newChapterText = this.state.chapterNameValue;
            if (!this.checkInput.isValidItemName(newChapterText)){  // don't allow invalid chapter names
                this.setState({
                    errorMsg: "That chapter name is invalid"
                });
                return;
            } else {
                let newChapterRequest =this.createRequest.createRequest(`${process.env.REACT_APP_SITE_ADDRESS}/api/chapter/add/${newChapterText}`, 'POST');
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
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                    fetch(logErrorRequest);
                });
            }
    }

    cancelChapterAdd = () => {
            this.props.showAddChapterDialog(false);
    }

    handleChange = (event) => {  // change value of chapter name textbox
        this.setState({
            chapterNameValue: event.target.value,
        });
    }

    render(){
        return (
            <div id="dialog-background">
                <ClickAwayListener
                    onClickAway={ () => {this.props.showAddChapterDialog(false)} }
                >
                    <div id="add-chapter-dialog" className="dialog">
                        <p className="dialog-title">Add chapter</p>
                        <div id="chapter-name-box">
                        <TextField
                            label="Chapter name"
                            variant="outlined"
                            size="small"
                            value={this.state.value}
                            onChange={this.handleChange}
                            ref={this.chapterName}
                        ></TextField>
                            <p className="error" id="error">{this.state.errorMsg}</p>
                        </div>
                        <div className="flex-container chapter-btns">
                            <Button 
                                className="btn btn--yellow"
                                variant="contained"
                                ref={this.saveBtn}
                                onClick={this.addChapter}
                            >
                                Save
                            </Button>
                            <Button 
                                className="btn --btn--white"
                                variant="contained"
                                onClick={this.cancelChapterAdd}
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


export default AddChapterDialog;