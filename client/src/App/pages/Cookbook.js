import React, { Component } from "react";
import AddChapterDialog from "../Components/AddChapterDialog.js";
import AddRecipeDialog from "../Components/AddRecipeDialog.js";
import Header from '../Components/Header.js';
//import { createRequest } from '../modules/createRequest.js';
//import { showAddChapterDialog } from '../modules/showAddChapterDialog.js';
//import { showAddRecipeDialog } from '../modules/showAddRecipeDialog.js';


class Cookbook extends Component {
    constructor(){
        super();
        //console.log(createRequest);
        //console.log(showAddChapterDialog);

        this.state = {
            showAddChapter: false,
            showAddRecipe: false
        };

        this.displayAddChapterWindow = this.displayAddChapterWindow.bind(this);
        this.displayAddRecipeWindow = this.displayAddRecipeWindow.bind(this);
    }

    //showAddChapterDialogBox = showAddChapterDialog;
    //showAddRecipeDialogBox = showAddRecipeDialog;

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

    render(){
        return (
            <div className="App">
                <Header />
                <div id="dialogWindow">
                    {this.state.showAddChapter && <AddChapterDialog showAddChapterDialog={this.displayAddChapterWindow} />}
                    {this.state.showAddRecipe && <AddRecipeDialog showAddRecipeDialog={this.displayAddRecipeWindow} />}

                </div>
                
                Build out recipes later
                <div className="add-bar flex-container">
                    <div id="add-chapter" className="add-btn" onClick={() => this.displayAddChapterWindow(true)}><div className="add-sign">+</div>Add chapter</div><div id="add-recipe" className="add-btn" onClick={()=>{ this.displayAddRecipeWindow(true) }}><div className="add-sign">+</div>Add recipe</div>
                </div>
            </div>
        );
    }

}

export default Cookbook;