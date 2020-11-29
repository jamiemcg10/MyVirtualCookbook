import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import notesImg from '../../Images/text-documents-line.png';

class Recipe extends Component{
    constructor(props){
        super(props);

        this.recipe = this.props.content;
        this.chapter = this.props.chapter;
        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');

        this.state = {
            notesOpen: "false",
            notesDisabled: false,
            notes: this.props.content.recipeNotes,
        }

        this.showNotes = this.showNotes.bind(this);
        this.displayRecipe = this.displayRecipe.bind(this);

        this.notesWindow = null;


    } // end constructor

    showNotes(){
        if (this.state.notesOpen === "false"){
            this.setState({
                notesOpen: "true"
            });
        } else if (this.state.notesOpen === "true"){
            this.setState({
                notesOpen: "false"
            });
        }
    }


    displayRecipe(){
        // TODO: i think this will do weird things if i close the main cookbook page while a recipe 
        // page is open and then re-open the cookbook page later - check
        this.setState({
            notesDisabled: true,
        });
        if (this.recipe.method === "iframe") {
            // go to recipe page
            let recipeWindow = window.open(`/recipe/${this.props.chapter}/${this.props.content.nameId}`);
            recipeWindow.addEventListener("unload", ()=>{
                console.log(recipeWindow.location.href);
                if (recipeWindow.location.href !== "about:blank"){
                    this.setState({
                        notesDisabled: false,
                        // TODO: SET NOTEs
                        notes: recipeWindow.document.getElementsByTagName("textarea")[0].value
                    });
                    
                    this.notesWindow = null;
                }
            });
        } else if (this.recipe.method === "new_window") {
            console.log(this.notesWindow);
            let recipeWindow = window.open(this.props.content.recipeLink);
            if (this.notesWindow === null){
                this.notesWindow = window.open(`/notes/${this.props.chapter}/${this.props.content.nameId}`, "_blank", "height=300,width=300,location=0");
            }

            // is there a better way to do this?
            recipeWindow.addEventListener("unload", (event)=>{  // TODO: try to get this to work
                console.log(event);
                console.log(recipeWindow);
                console.log("new window should be closing");
                //notesWindow.close();
            });


            this.notesWindow.addEventListener("unload", ()=>{
                if (this.notesWindow.location.href !== "about:blank"){
                    this.setState({
                        notesDisabled: false,
                        notes: this.notesWindow.document.getElementsByTagName("textarea")[0].value
                    });
                    
                    this.notesWindow = null;
                }
            });

        }
    }


    render(){

        let chapter = this.props.chapter;
        let recipeId = this.props.content.nameId;

        return (
            <Draggable key={recipeId} draggableId={recipeId} index={this.props.index}>
                {(provided)=>(
                    <div className='recipe' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>
                            <li recipeType={this.props.content.method} chapterName={chapter} link={this.props.content.recipeLink} itemType="recipe" onClick={()=>{this.displayRecipe()}} onContextMenu={(event)=>{this.props.sendRightClick(event)}}>{this.props.content.name}</li>
                            <img className="recipe-icon" src={notesImg} onClick={()=>{this.showNotes()}}/>
                        </div>
                        <textarea className="cookbook-notes" notesOpen={this.state.notesOpen} disabled={this.state.notesDisabled} value={this.state.notes} onChange={(event)=>{this.accessNotes.updateNotes(event, chapter, recipeId); this.setState({notes: event.target.value});}}></textarea>
                    </div>
                )}
            </Draggable>
        );
    }

}


export default Recipe;