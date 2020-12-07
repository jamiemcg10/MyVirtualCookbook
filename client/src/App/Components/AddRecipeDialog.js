import React, {Component} from "react";
import $ from 'jquery';

class AddRecipeDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            chapterNames: [],
            recipeNameValue: '',
            recipeLinkValue: '',
            recipeChapterValue: '',
            newChapterNameValue: '',
            errorMsg: ''
        };

        // import modules
        this.createRequest = require('../modules/createRequest.js');
        this.checkInput = require('../modules/checkInput.js');

        // bind methods
        this.addRecipe = this.addRecipe.bind(this);
        this.cancelRecipeAdd = this.cancelRecipeAdd.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleChapterChange = this.handleChapterChange.bind(this);
        this.handleNewChapterChange = this.handleNewChapterChange.bind(this);
        this.getChapters = this.getChapters.bind(this);

        this.NEW_CHAPTER = "< + New Chapter >";  // value for new chapter dropdown item
        this.getChapters();  // get a list of chapters to display in the dropdown
    }

    componentDidMount(){
        // save recipe if Enter key pressed
        $(document).on("keyup", (event)=>{
            if (event.key === "Enter"){
                $('#recipe-save').trigger("click");
            }
        });
        $('#recipe-name').trigger("focus");  // put cursor in recipe name textbox
    }

    getChapters(){
        // get a list of chapters in the cookbook
        let chapters="";
        let getChaptersRequest = this.createRequest.createRequest(`${process.env.REACT_APP_SITE_ADDRESS}/api/chapters`, 'GET');
        fetch(getChaptersRequest).then(
            (response)=>{
                response.json().then((json)=>{
                    if (json.success){
                        chapters = json.chapters;
                        if (chapters.length === 0){ // recipes must be added to a chapter
                            chapters.push("[Unclassified]");
                        }
                        chapters.push(this.NEW_CHAPTER);
                        this.setState({
                            chapterNames: chapters,
                            recipeChapterValue: chapters[0]
                        });
                        return;
                    } else {
                        // there was a problem getting the chapters - show a message
                        this.setState({
                            errorMsg: json.message,
                        });
                        return;
                    }
                })
            }).catch(error=>{
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                    fetch(logErrorRequest);
            });

    }

    addRecipe(){
        // adds recipe to cookbook
        this.setState({  // reset error message when called
            errorMsg: '',
        });

        let newRecipeName = this.state.recipeNameValue;
        let newRecipeLink = this.state.recipeLinkValue;
        let newRecipeChapter = this.state.newChapterNameValue || this.state.recipeChapterValue;  // add to new chapter or existing chapter

        if (!this.checkInput.isValidItemName(newRecipeName)){  // validate recipe name
            this.setState({
                errorMsg: 'Please enter a valid recipe name',
            });
            return;
        }

        if (!this.checkInput.isValidLink(newRecipeLink)){  // validate recipe link
            this.setState({
                errorMsg: 'Please enter a valid link',
            });
            return;
        }

        if (this.state.newChapterNameValue && !this.checkInput.isValidItemName(newRecipeChapter)){  // validate chapter name if new chapter
            this.setState({
                errorMsg: 'Please enter a valid chapter name',
            });
            return;
        }

        let requestBody = {
            name: newRecipeName,
            link: newRecipeLink,
            chapter: newRecipeChapter,
            source: "link"  // TODO: change if img uploads are allowed
        };
        requestBody = JSON.stringify(requestBody);

        let newRecipeRequest = this.createRequest.createRequestWithBody(`${process.env.REACT_APP_SITE_ADDRESS}/api/recipe/add`, 'POST', requestBody);
        fetch(newRecipeRequest)
            .then((response) => {
                response.json().then((json) => {
                    if (json.success){  // close window and re-render cookbook if adding was successful
                        this.props.showAddRecipeDialog(false);
                        this.props.rerenderCookbook();
                    } else {
                        this.setState({  // else display the error message
                            errorMsg: json.message
                        });

                    }
                }).catch(error=>{
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                    fetch(logErrorRequest);
                });
            });

    }

    cancelRecipeAdd(){
        this.props.showAddRecipeDialog(false);
    }

    handleNameChange(event){  // holds the value in the recipe name box
        this.setState({
            recipeNameValue: event.target.value,
        })
    }

    handleLinkChange(event){  // holds the value in the recipe link box
        this.setState({
            recipeLinkValue: event.target.value,
        });
    }

    handleChapterChange(event){  // holds the value in the chapter dropdown
        if (this.state.newChapterNameValue !== this.NEW_CHAPTER){ // if the chapter recipe is being added to isn't new, set the new chapter name to null
            this.setState({
                newChapterNameValue: ''
            });
        }
        this.setState({
            recipeChapterValue: event.target.value,
        });
    }

    handleNewChapterChange(event){  // holds the value in the new chapter name box
        this.setState({
            newChapterNameValue: event.target.value,
        });
    }


    render(){        
        let chapterList = this.state.chapterNames;

        return(
            <div id="dialog-background">
            <div id="add-recipe-dialog" className="dialog"> 
                <p className="dialog-title">Add recipe</p>
                <div id="recipe-name-box">
                    <label for="recipe-name">Recipe name:</label>
                    <br/>
                    <input type="text" id="recipe-name" className = "add-recipe-input" onChange={this.handleNameChange}></input>
                    <br/>
                    <label for="recipe-link">Recipe link:</label>
                    <br/>
                    <input type="text" id="recipe-link" className="add-recipe-input" onChange={this.handleLinkChange}></input>
                    <br/>
                    <label for="chapter-name">Chapter: </label>
                    <br/>
                    <select id="recipe-chapter-select"  onChange={this.handleChapterChange}>
                        {chapterList.map((chapter)=><option key={chapter.replaceAll(" ")}>{ chapter }</option>)}
                    </select>
                    <br/>
                    {this.state.recipeChapterValue === this.NEW_CHAPTER &&   
                        <div id="new-chapter-div">
                            <label for="new-chapter-name">New chapter name:</label>
                            <br/>
                            <input type="text" id="new-chapter-name" className = "add-recipe-input" onChange={this.handleNewChapterChange}></input>
                            <br/>
                        </div>
                    }
                    <p className="error" id="error">{this.state.errorMsg}</p>
                </div>
                <div className="flex-container recipe-btns">
                    <button id="recipe-save" onClick={this.addRecipe}>Save</button>
                    <button id="recipe-cancel" onClick={this.cancelRecipeAdd}>Cancel</button>
                </div>
            </div> 
        </div>
        );
    }

}

export default AddRecipeDialog;