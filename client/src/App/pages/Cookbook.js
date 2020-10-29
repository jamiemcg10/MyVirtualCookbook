import fetch from "node-fetch";
import React, { Component } from "react";
import AddChapterDialog from "../Components/AddChapterDialog.js";
import AddRecipeDialog from "../Components/AddRecipeDialog.js";
import Header from '../Components/Header.js';
import Chapter from '../Components/Chapter.js';

class Cookbook extends Component {
    constructor(){
        super();

        this.state = {
            showAddChapter: false,
            showAddRecipe: false,
            cookbook: [],
        };

        this.createRequest = require('../modules/createRequest.js');

        this.displayAddChapterWindow = this.displayAddChapterWindow.bind(this);
        this.displayAddRecipeWindow = this.displayAddRecipeWindow.bind(this);
        this.rerenderCookbook = this.rerenderCookbook.bind(this);
        this.getCookbook = this.getCookbook.bind(this);
        this.toggleChapter = this.toggleChapter.bind(this);
        
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
                
                <div id="cookbook">
                <ul>
                        { cookbook.map((chapter) => 
                           <Chapter name={chapter.chapterName} recipes={chapter.recipes}/>
                        )}
                        
                </ul>

                </div>
                <div className="add-bar flex-container">
                    <div id="add-chapter" className="add-btn" onClick={() => this.displayAddChapterWindow(true)}><div className="add-sign">+</div>Add chapter</div><div id="add-recipe" className="add-btn" onClick={()=>{ this.displayAddRecipeWindow(true) }}><div className="add-sign">+</div>Add recipe</div>
                </div>
            </div>
        );
    }

}

export default Cookbook;