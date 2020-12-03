import fetch from "node-fetch";
import React, { Component } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import $ from 'jquery';
import _ from 'lodash';
import AddChapterDialog from "../Components/AddChapterDialog.js";
import AddRecipeDialog from "../Components/AddRecipeDialog.js";
import CustomContextMenu from '../Components/CustomContextMenu.js';
import RenameChapterRecipeDialog from '../Components/RenameChapterRecipeDialog.js';
import DeleteChapterRecipeDialog from '../Components/DeleteChapterRecipeDialog.js';
import Header from '../Components/Header.js';
import Chapter from '../Components/Chapter.js';
import CookiePopupWarning from '../Components/CookiePopupWarning.js';

// main cookbook page /main
class Cookbook extends Component {
    constructor(props){
        super(props);

        this.state = {
            showAddChapter: false,
            showAddRecipe: false,
            showContextMenu: false,
            showRename: false,
            showDelete: false,
            textToModify: '',
            itemTypeToModify: '',
            recipeChapter: '',
            searchbarValue: '',
            cookbook: [],
            filteredCookbook: [],
            cookiesAccepted: true,  // default to true for loading purposes
        };

        this.createRequest = require('../modules/createRequest.js');

        // bind methods
        this.displayAddChapterWindow = this.displayAddChapterWindow.bind(this);
        this.displayAddRecipeWindow = this.displayAddRecipeWindow.bind(this);
        this.rerenderCookbook = this.rerenderCookbook.bind(this);
        this.getCookbook = this.getCookbook.bind(this);
        this.toggleChapter = this.toggleChapter.bind(this);
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.displayContextMenu = this.displayContextMenu.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.displayRenameDialog = this.displayRenameDialog.bind(this);
        this.displayDeleteDialog = this.displayDeleteDialog.bind(this);
        this.filterCookbook = this.filterCookbook.bind(this);
        this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
        this.checkCookieAcceptance = this.checkCookieAcceptance.bind(this);
        
        if (window.location.hash === '#_=_'){  // remove chars added after fb login
            window.location.hash = '';
        }

        this.getCookbook();
        this.checkCookieAcceptance();

    }

    componentDidMount(){
        $('body').on("click", ()=>{  // hide context menu when user clicks somewhere else
            this.displayContextMenu(false);
        });
    }

    displayAddChapterWindow(bool){
        this.setState({
            showAddChapter: bool,
        });
    }

    displayAddRecipeWindow(bool){
        this.setState({
            showAddRecipe: bool,
        });
    }

    displayContextMenu(bool){
        this.setState({
            showContextMenu: bool,
        });
    }

    displayRenameDialog(bool){
        console.log(bool);
        this.setState({
            showRename: bool,
        });
    }

    displayDeleteDialog(bool){
        console.log(bool);
        this.setState({
            showDelete: bool,
        });
    }


    // get all chapters and recipes
    async getCookbook(){
       let recipeRequest = this.createRequest.createRequest("/api/recipes", "GET");
       fetch(recipeRequest).then(
           (response)=> { response.json().then(
               (json)=>{
                this.setState({
                    cookbook: json.recipes,
                });
               })
           }).catch(error=>{
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: error}));
                fetch(logErrorRequest);
            });
   }
    
   
    rerenderCookbook(){  // called to re-display cookbook after a change
        this.getCookbook();     
    }

    filterCookbook(filterText){
        // returns a version of the cookbook that contains only entries that contain the filterText

        let searchText = filterText.toLowerCase();

        // create a clone of the copy to leave original unaffected 
        let cookbookCopy = _.cloneDeep(this.state.cookbook);  


        let filteredCookbook = [];  // start with empty cookbook and add

        for (let i=0; i<cookbookCopy.length; i++){  // iterate through chapters in cookbook copy
            if (cookbookCopy[i].chapterName.toLowerCase().indexOf(searchText) >= 0){ // search text is in chapter name
                filteredCookbook.push(cookbookCopy[i]);  // add entire chapter
            } else {
                let recipes = cookbookCopy[i].recipes;
                for (let j=0; j<recipes.length; j++){ // loop through recipes in chapter to check for match
                    if (recipes[j].name.toLowerCase().indexOf(searchText) >= 0){ // search text is in recipe name
                        if (filteredCookbook.length === 0 || filteredCookbook[filteredCookbook.length-1].chapterName !== cookbookCopy[i].chapterName){ // chapter is not already in filtered cookbook
                            filteredCookbook.push(cookbookCopy[i]); // add entire chapter
                            filteredCookbook[filteredCookbook.length-1].recipes = [];  // remove all recipes from chapter
                        } 
                            filteredCookbook[filteredCookbook.length-1].recipes.push(recipes[j]); // add recipe

                    }
                }
            }
        }

        this.setState({
            filteredCookbook: filteredCookbook
        });

    }

    toggleChapter(id){ 
        // change attribute to determine whether chapter shows as open or closed

        if ($(`#${id}`).attr("display") === "open"){
            $(`#${id}`).attr("display", "closed");
            $(`[key='${id}']`).attr("display", "closed");
        } else if ($(`#${id}`).attr("display") === "closed"){
            $(`#${id}`).attr("display", "open");
            $(`[key='${id}']`).attr("display", "open");
        }
    }

    showMenu(event){
        this.displayContextMenu(false);  // hide menu before it's shown again
        //$(event.target).attr('itemType');  // I don't know what this does
        let x = event.clientX;
        let y = event.clientY;

        this.setState({
            textToModify: event.target.innerText,
            itemTypeToModify: event.target.getAttribute('itemType')
        });

        if (event.target.getAttribute('itemType') === 'recipe'){  // set chapter for recipe to find more easily
            this.setState({
                recipeChapter: event.target.getAttribute('chaptername')
            });
        }
        
        // better for performance if this can stay here, but might need to move again
        // set position of context menu to be where user clicked
        $('#customContextWindow').css('left', x);
        $('#customContextWindow').css('top', y);


        this.displayContextMenu(true);

        // $('#customContextWindow').css('left', x);
        // $('#customContextWindow').css('top', y);

    }

    handleSearchBarChange(event){  
        // update value in search bar as user types and filter the cookbook
        this.setState({
            searchbarValue: event.target.value
        });
        this.filterCookbook(event.target.value);
    }

    async handleOnDragEnd(result){
        console.log(result);  // leaving this in for now until I figure out how to enhance dropping
        console.log(result.destination.index);

        if (!result.destination){
            return;
        }

        let cookbookCopy = this.state.cookbook;

        let oldChapter = cookbookCopy.find((chapter) => {  // find chapter where recipe started
            return chapter.chapterName === result.source.droppableId;
        });

        // let recipeIndex = oldChapter.recipes.findIndex((recipe)=>{  // find index of recipe in original chapter
        //     return recipe.nameId === result.draggableId;
        // });
        let recipeIndex = result.source.index;
        let newRecipeIndex = result.destination.index;
        
        let recipe = oldChapter.recipes[recipeIndex];  // get recipe that was moved

        let newChapter = cookbookCopy.find((chapter) => {  // find the chapter the recipe is being moved to
            return chapter.chapterName === result.destination.droppableId;
        });

        //newChapter.recipes.push(recipe);  // add the recipe to the chapter where the recipe was dropped
        if (result.source.droppableId === result.destination.droppableId){  // recipe being moved in same chapter
            let recipeCopy = _.cloneDeep(recipe); // create deep clone of recipe to move it independently
            if (result.source.index > result.destination.index){  // being moved up
                oldChapter.recipes.splice(recipeIndex, 1);  // remove the recipe from the original chapter
                newChapter.recipes.splice(newRecipeIndex, 0, recipeCopy);  // add recipe where it was dropped   
            } else if (result.source.index < result.destination.index){  // being moved back
                newChapter.recipes.splice(recipeIndex,1);  // insert the recipe into the new chapter
                newChapter.recipes.splice(newRecipeIndex,0,recipeCopy); // remove the recipe from the old chapter
            }
        } else {
            oldChapter.recipes.splice(recipeIndex, 1);  // remove the recipe from the original chapter
            newChapter.recipes.splice(newRecipeIndex, 0, recipe);  // add recipe where it was dropped
        }

        this.setState({  // update the state so the cookbook will re-render
            cookbook: cookbookCopy,
        });
            
        // it takes longer to update cookbook in the database, so do this separately and asynchronously
        let changeChapterRequest = this.createRequest.createRequest(`/api/recipe/move/${result.source.droppableId}/${recipeIndex}/${result.destination.droppableId}/${newRecipeIndex}`, 'PUT');
        fetch(changeChapterRequest).then((response)=>{
            response.json().then((json) => {
                ;
            }).catch((error)=>{
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: error}));
                fetch(logErrorRequest);
            });
        });
        
    }

    checkCookieAcceptance(){
        let checkCookieRequest = this.createRequest.createRequest(`/api/checkCookieAcceptance`, "GET");
        fetch(checkCookieRequest)
            .then((response)=>{
                response.json().then((json)=>{
                    if (json.success){ 
                        this.setState(
                            { cookiesAccepted: json.cookiesAccepted
                            }
                        )
                    }
                })
            });
    }

    showCookiePopupWarning(bool){
        if (!bool){
            this.setState({
                cookiesAccepted: true
            });
        }
    }

 

    // return main cookbook with DragDropContext
    render(){
        console.log("rerendering cookbook");
        let cookbook;

        // choose which cookbook to use
        if (this.state.searchbarValue === ''){
            cookbook = this.state.cookbook;
        } else {
            cookbook = this.state.filteredCookbook;
        }

        return (
            <div className="App">
                <Header />
                <div id="dialogWindow">
                    {this.state.showAddChapter && <AddChapterDialog showAddChapterDialog={this.displayAddChapterWindow} rerenderCookbook={this.rerenderCookbook}/>}
                    {this.state.showAddRecipe && <AddRecipeDialog showAddRecipeDialog={this.displayAddRecipeWindow} rerenderCookbook={this.rerenderCookbook}/>}
                
                </div>
                <div id="customContextWindow">
                    {this.state.showContextMenu && <CustomContextMenu showContextMenu={this.displayContextMenu} renameItem={(bool) => {console.log(bool); this.displayRenameDialog(bool)}} deleteItem={this.displayDeleteDialog}/>}
                </div>
                <div id="smallDialogWindow">
                    {this.state.showRename && <RenameChapterRecipeDialog showRenameChapterRecipeDialog={this.displayRenameDialog} itemTypeToModify={this.state.itemTypeToModify} textToModify={this.state.textToModify} recipeChapter={this.state.recipeChapter} rerenderCookbook={this.rerenderCookbook} />}
                    {this.state.showDelete && <DeleteChapterRecipeDialog showDeleteChapterRecipeDialog={this.displayDeleteDialog} itemTypeToDelete={this.state.itemTypeToModify} textToDelete={this.state.textToModify} recipeChapter={this.state.recipeChapter} rerenderCookbook={this.rerenderCookbook} />}
                </div>
                <input type="text" id="search-bar" placeholder="Search recipes" value={this.state.searchbarValue} onChange={this.handleSearchBarChange}></input>
                <div id="cookbook">
                    <DragDropContext onDragEnd={this.handleOnDragEnd}x>
                    { cookbook.length > 0 &&
                       <ul>
                                { cookbook.map((chapter, index) => 
                                    <Chapter name={chapter.chapterName} recipes={chapter.recipes} rightClick={ (event)=>{this.showMenu(event);} } index={index}/>
                                )} 
                        
                        </ul>
                    }    
                    { (cookbook.length === 0 && this.state.searchbarValue !== '') &&
                       <div id="empty-search-results">No recipes found</div>
                    }         
                     </DragDropContext>  

                </div>
                {!this.state.cookiesAccepted && <CookiePopupWarning accepted={this.state.cookiesAccepted} showCookiePopupWarning={(bool) => {this.showCookiePopupWarning(bool)}}/>}
                <div className="add-bar flex-container">
                    <div id="add-chapter" className="add-btn" onClick={() => this.displayAddChapterWindow(true)}><div className="add-sign">+</div>Add chapter</div><div id="add-recipe" className="add-btn" onClick={()=>{ this.displayAddRecipeWindow(true) }}><div className="add-sign">+</div>Add recipe</div>
                </div>
            </div>
        );
    }

}

export default Cookbook;