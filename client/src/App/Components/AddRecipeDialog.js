import React, {Component} from "react";

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

        this.createRequest = require('../modules/createRequest.js');

        this.addRecipe = this.addRecipe.bind(this);
        this.cancelRecipeAdd = this.cancelRecipeAdd.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleChapterChange = this.handleChapterChange.bind(this);
        this.handleNewChapterChange = this.handleNewChapterChange.bind(this);
        this.getChapters = this.getChapters.bind(this);

        this.NEW_CHAPTER = "< + New Chapter >";
        this.getChapters();
    }

    getChapters(){
        let chapters="";
        let getChaptersRequest = this.createRequest.createRequest(`http://localhost:5000/api/chapters`, 'GET');
        fetch(getChaptersRequest).then(
            (response)=>{
                response.json().then((json)=>{
                    console.log(json.success);
                    console.log(json.message);
                    if (json.success){
                        console.log(json.chapters);
                        chapters = json.chapters;
                        chapters.push(this.NEW_CHAPTER);
                        this.setState({
                            chapterNames: chapters,
                            recipeChapterValue: chapters[0]
                        });
                        console.log("chapter names have been added");
                        return;
                    } else {
                        // there was a problem getting the chapters - show a message
                        this.setState({
                            errorMsg: json.message,
                        });
                        return;
                    }
                })
            });

    }

    addRecipe(){
        this.setState({
            errorMsg: '',
        });

        let newRecipeName = this.state.recipeNameValue;
        let newRecipeLink = this.state.recipeLinkValue;
        let newRecipeChapter = this.state.newChapterNameValue || this.state.recipeChapterValue;

        let validLink = RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");

        console.log(newRecipeLink);
        console.log(validLink.test(newRecipeLink));

        if (newRecipeName === ""){
            this.setState({
                errorMsg: 'Please enter a valid recipe name',
            });
            return;
        } else if (newRecipeLink === "" || !validLink.test(newRecipeLink)){
            this.setState({
                errorMsg: 'Please enter a valid link',
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

        let newRecipeRequest = this.createRequest.createRequestWithBody(`http://localhost:5000/api/recipe/add`, 'POST', requestBody);
        console.log(newRecipeRequest);
        // TODO: add a way to add chapter from this dialog box

        fetch(newRecipeRequest)
        .then((response) => {
            response.json().then((json) => {
                console.log(json);
                if (json.success){
                    this.props.showAddRecipeDialog(false);
                } else {
                    this.setState({
                        errorMsg: json.message
                    });

                }
            });
        });

    }

    cancelRecipeAdd(){
        this.props.showAddRecipeDialog(false);
    }

    handleNameChange(event){
        this.setState({
            recipeNameValue: event.target.value,
        })
    }

    handleLinkChange(event){
        this.setState({
            recipeLinkValue: event.target.value,
        });
    }

    handleChapterChange(event){
        if (this.state.newChapterNameValue !== this.NEW_CHAPTER){ // if the chapter recipe is being added to isn't new, set the new chapter name to null
            this.setState({
                newChapterNameValue: ''
            });
        }
        this.setState({
            recipeChapterValue: event.target.value,
        });
    }

    handleNewChapterChange(event){
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
                    <input type="text" id="recipe-name" className = "add-recipe-input" value={this.state.recipeNameValue} onChange={this.handleNameChange}></input>
                    <br/>
                    <label for="recipe-link">Recipe link:</label>
                    <br/>
                    <input type="text" id="recipe-link" className="add-recipe-input" value={this.state.recipeLinkValue} onChange={this.handleLinkChange}></input>
                    <br/>
                    <label for="chapter-name">Chapter: </label>
                    <br/>
                    <select id="recipe-chapter-select" value={this.state.recipeChapterValue} onChange={this.handleChapterChange}>
                        {chapterList.map((chapter)=><option key={chapter.replaceAll(" ")}>{ chapter }</option>)}
                    </select>
                    <br/>
                    {this.state.recipeChapterValue === this.NEW_CHAPTER &&   
                        <div id="new-chapter-div">
                            <label for="new-chapter-name">New chapter name:</label>
                            <br/>
                            <input type="text" id="new-chapter-name" className = "add-recipe-input" value={this.state.newChapterNameValue} onChange={this.handleNewChapterChange}></input>
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