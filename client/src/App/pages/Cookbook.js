import fetch from "node-fetch";
import React, { Component } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import $ from 'jquery';
import AddChapterDialog from "../Components/AddChapterDialog.js";
import AddRecipeDialog from "../Components/AddRecipeDialog.js";
import CustomContextMenu from '../Components/CustomContextMenu.js';
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
            cookbook: [],
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
        this.displayRenameChapterRecipeDialog = this.displayRenameChapterRecipeDialog.bind(this);
        this.displayDeleteChapterRecipeDialog = this.displayDeleteChapterRecipeDialog.bind(this);
        
        if (window.location.hash === '#_=_'){
            window.location.hash = '';
        }

        this.getCookbook();

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

    displayRenameChapterRecipeDialog(bool){
        this.setState({
            showRename: bool,
        });
    }

    displayDeleteChapterRecipeDialog(bool){
        this.setState({
            showDelete: bool,
        });
    }

    componentDidMount(){
        $('body').on("click", ()=>{
            console.log("clicking somewhere");
            this.displayContextMenu(false);
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
                console.log(this.state.cookbook);
               })
           })
   }
    
    rerenderCookbook(){
        this.getCookbook();
        console.log(this.state.cookbook);        
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
        console.log(event.target.innerText);
        let x = event.clientX;
        let y = event.clientY;
        console.log(x, y);
        
        this.displayContextMenu(true);

        $('#customContextWindow').css('left', x);
        $('#customContextWindow').css('top', y);

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
                //this.rerenderCookbook();
            }).catch((error)=>{
                console.log(error);
            });
        });
        
    }

    render(){
        let cookbook = this.state.cookbook;
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
                    {this.state.showContextMenu && <CustomContextMenu showContextMenu={this.displayContextMenu}/>}
                </div>
                <div id="smallDialogWindow">
                    {this.state.showRename && <RenameChapterRecipeDialog />}
                    {this.state.showDelete && <DeleteChapterRecipeDialog />}
                </div>
                
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