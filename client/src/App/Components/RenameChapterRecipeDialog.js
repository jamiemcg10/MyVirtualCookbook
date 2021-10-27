import React, { Component } from "react";
import { Button, ClickAwayListener, TextField } from '@material-ui/core'
import './styles/DeleteRenameChapterRecipeDialog.css'

// dialog window to rename an existing chapter
class RenameChapterRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            newNameValue: this.props.textToModify,
            errorMsg: ''
        };


        // import modules
        this.checkInput = require('../modules/checkInput.js');
        this.createRequest = require('../modules/createRequest.js');

        this.saveBtn = React.createRef();
        this.chapterName = React.createRef();
    }

    componentDidMount(){
        document.addEventListener("keyup", this.hitEnter);
        let chapterNameInput = this.chapterName.current.childNodes[1].childNodes[0];
        chapterNameInput.focus();  // put cursor in chapter name box when component loads
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.hitEnter);
    }
    hitEnter = (event) => {
        if (event.key === "Enter"){
            this.saveBtn.current.click();
        }
    }

    changeItem = () => {
        this.setState({
            errorMsg: ''
        });
        if (this.checkInput.hasInjection(this.state.newNameValue)){ 
            this.setState({
                errorMsg: 'Please enter a valid chapter name'
            });
            return;
        }

        if (this.state.newNameValue === this.props.textToModify){  // text is the same
            this.props.showRenameChapterRecipeDialog(false);
            // no need to rerender
            return;
        }

        if (this.props.itemTypeToModify === 'chapter'){  // rename chapter
            let changeChapterRequest = this.createRequest.createRequest(`/api/chapter/rename/${this.props.textToModify}/${this.state.newNameValue}`, 'PUT');
            fetch(changeChapterRequest).then((response)=>{response.json().then(json => {
                if (json.success){  // rename was successful - close dialog and redisplay cookbook
                    this.props.showRenameChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error
                    this.setState({
                        errorMsg: json.message
                    });
                }
            })})
            .catch(error=>{
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                fetch(logErrorRequest);
            });
        
        } else if (this.props.itemTypeToModify === 'recipe'){  // rename recipe
            let changeRecipeRequest = this.createRequest.createRequest(`/api/recipe/rename/${this.props.textToModify}/${this.props.recipeChapter}/${this.state.newNameValue}`, 'PUT');
            fetch(changeRecipeRequest).then((response)=>{response.json().then(json => {
                if (json.success){  // rename was successful - close dialog and redisplay cookbook
                    this.props.showRenameChapterRecipeDialog(false);
                    this.props.rerenderCookbook();
                } else {  // show error
                    this.setState({
                        errorMsg: json.message
                    });
                }
            })})
            .catch(error=>{
                this.setState({
                    errorMsg: 'Sorry, something went wrong. Please try again later.'
                });
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                fetch(logErrorRequest);
            });
        } else{
            // there's an error - either a chapter or recipe should have been selected
            this.setState({
                errorMsg: 'Sorry, something went wrong. Please try again later.'
            });
        }
    }

    cancelRename = () => {
        this.props.showRenameChapterRecipeDialog(false);

    }

    handleChange = (event) => {
        this.setState({
            newNameValue: event.target.value,
        });
    }

    render(){
        return (
            <div id="dialog-background">
                <ClickAwayListener
                    onClickAway={() => this.props.showRenameChapterRecipeDialog(false)}
                >
                    <div id="rename-dialog" className="dialog">
                        <p className="dialog-title">Rename {this.props.itemTypeToModify}</p>
                        <div id="rename-box">
                            <TextField
                                id="chapter-recipe-name"
                                label="New name"
                                variant="outlined"
                                size="small"
                                ref={this.chapterName}
                                value={this.state.newNameValue}
                                onChange={this.handleChange}
                            ></TextField>
                            <p className="error" id="error">{this.state.errorMsg}</p>
                        </div>
                        <div className="flex-container chapter-btns">
                            <Button 
                                id="rename-save" 
                                variant="contained"
                                onClick={this.changeItem}
                            >
                                    Rename
                            </Button>
                            <Button 
                                id="rename-cancel" 
                                variant="contained"
                                onClick={this.cancelRename}
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


export default RenameChapterRecipeDialog;