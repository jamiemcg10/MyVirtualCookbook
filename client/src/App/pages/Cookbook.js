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

class Cookbook extends Component {
    constructor(){
        super();

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
            filteredCookbook: []
        };

        this.createRequest = require('../modules/createRequest.js');

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
        
        if (window.location.hash === '#_=_'){
            window.location.hash = '';
        }

        this.getCookbook();

    }

    componentDidMount(){
        $('body').on("click", ()=>{
            console.log("clicking somewhere");
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



    async getCookbook(){
       let recipeRequest = this.createRequest.createRequest("/api/recipes", "GET");
       fetch(recipeRequest).then(
           (response)=> { response.json().then(
               (json)=>{
                console.log(json.recipes);
                this.setState({
                    cookbook: json.recipes,
                });
                //this.forceUpdate();
                //console.log(this.state.cookbook);
               })
           })
   }
    
    rerenderCookbook(){
        this.getCookbook();
        console.log(this.state.cookbook);        
    }

    filterCookbook(filterText){
        console.log("filtering cookbook");
        let searchText = filterText.toLowerCase();
        let cookbookCopy = _.cloneDeep(this.state.cookbook);
        console.log(this.state.cookbook);
        console.log(cookbookCopy);
        // if (filterText === ''){
        //     this.setState({
        //         filteredCookbook: []
        //     });
        // }
        let filteredCookbook = [];
        for (let i=0; i<cookbookCopy.length; i++){
            console.log(`search text: ${searchText}`);
            if (cookbookCopy[i].chapterName.toLowerCase().indexOf(searchText) >= 0){ // search text is in chapter name
                console.log(`search text is in chapter name ${cookbookCopy[i].chapterName}`);
                filteredCookbook.push(cookbookCopy[i]);
            } else {
                let recipes = cookbookCopy[i].recipes;
                for (let j=0; j<recipes.length; j++){ // loop through recipes in chapter to check for match
                    if (recipes[j].name.toLowerCase().indexOf(searchText) >= 0){ // search text is in recipe name
                        console.log(`search text is in recipe name ${recipes[j].name}`);
                        if (filteredCookbook.length === 0 || filteredCookbook[filteredCookbook.length-1].chapterName !== cookbookCopy[i].chapterName){ // chapter is not already in filtered cookbook
                            filteredCookbook.push(cookbookCopy[i]);
                            filteredCookbook[filteredCookbook.length-1].recipes = [];
                        } 
                            filteredCookbook[filteredCookbook.length-1].recipes.push(recipes[j]); // add recipe

                    }
                }
            }
        }

        console.log(filteredCookbook);
        this.setState({
            filteredCookbook: filteredCookbook
        });

    }

    toggleChapter(id){  // probably a better way to do this with react
        let rList = document.getElementById(id);
        let rTitle = document.querySelector([`key='${id}'`]);
        console.log(rTitle);
        //let testList = React.findDOMNode(id);

        if (rList.getAttribute("display") === "open"){
            rList.setAttribute("display", "closed");
            rTitle.setAttribute("display", "closed");
        } else if (rList.getAttribute("display") === "closed"){
            rList.setAttribute("display", "open");
            rTitle.setAttribute("display", "open");
        }
    }

    showMenu(event){
        console.log("in showMenu");
        this.displayContextMenu(false);
        console.log(event);
        console.log(event.target);
        $(event.target).attr('itemType');
        console.log($(event.target).attr('itemType'));
        console.log(event.target.getAttribute('itemType'));
        console.log(event.target.innerText);
        let x = event.clientX;
        let y = event.clientY;
        console.log(x, y);

        this.setState({
            textToModify: event.target.innerText,
            itemTypeToModify: event.target.getAttribute('itemType')
        });

        if (event.target.getAttribute('itemType') === 'recipe'){
            this.setState({
                recipeChapter: event.target.getAttribute('chaptername')
            });
        }
        
        this.displayContextMenu(true);

        $('#customContextWindow').css('left', x);
        $('#customContextWindow').css('top', y);

    }

    handleSearchBarChange(event){
        console.log(event.target.value);
        this.setState({
            searchbarValue: event.target.value
        });
        console.log(this.state.searchbarValue);
        this.filterCookbook(event.target.value);
    }

    async handleOnDragEnd(result){
        if (!result.destination){
            return;
        }
        console.log(result);

        let cookbookCopy = this.state.cookbook;

        let oldChapter = cookbookCopy.find((chapter) => {
            return chapter.chapterName === result.source.droppableId;
        });

        let recipeIndex = oldChapter.recipes.findIndex((recipe)=>{
            return recipe.nameId === result.draggableId;
        });
        
        let recipe = oldChapter.recipes[recipeIndex];

        let newChapter = cookbookCopy.find((chapter) => {
            return chapter.chapterName === result.destination.droppableId;
        });

        newChapter.recipes.push(recipe);
        oldChapter.recipes.splice(recipeIndex, 1);

        this.setState({
            cookbook: cookbookCopy,
        });
            
        let changeChapterRequest = this.createRequest.createRequest(`/api/recipe/move/${result.draggableId}/${result.source.droppableId}/${result.destination.droppableId}`, 'PUT');
        fetch(changeChapterRequest).then((response)=>{
            response.json().then((json) => {
                console.log(json);
            }).catch((error)=>{
                console.log(error);
            });
        });
        
    }

    render(){
        let cookbook;
        if (this.state.searchbarValue === ''){
            console.log("using full cookbook");
            cookbook = this.state.cookbook;
        } else {
            console.log("using filtered cookbook");
            cookbook = this.state.filteredCookbook;
        }
        console.log("are we rerendering?");
        console.log(cookbook);

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
                    <DragDropContext onDragEnd={this.handleOnDragEnd}>
                        <ul>
                                { cookbook.map((chapter, index) => 
                                    <Chapter name={chapter.chapterName} recipes={chapter.recipes} rightClick={ (event)=>{this.showMenu(event);} } index={index}/>
                                )} 
                        
                        </ul>
                            
                     </DragDropContext>  

                </div>
                <div className="add-bar flex-container">
                    <div id="add-chapter" className="add-btn" onClick={() => this.displayAddChapterWindow(true)}><div className="add-sign">+</div>Add chapter</div><div id="add-recipe" className="add-btn" onClick={()=>{ this.displayAddRecipeWindow(true) }}><div className="add-sign">+</div>Add recipe</div>
                </div>
            </div>
        );
    }

}

export default Cookbook;