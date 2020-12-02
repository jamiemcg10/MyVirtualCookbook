import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import notesImg from '../../Images/text-documents-line.png';

class Recipe extends Component{
    constructor(props){
        super(props);

        this.recipe = this.props.content;
        this.chapter = this.props.chapter;
        this.notesWindow = null;

        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');

        this.state = {
            notesOpen: "false",
            notesDisabled: false,
            notes: this.props.content.recipeNotes,
        }

        // bind methods
        this.showNotes = this.showNotes.bind(this);
        this.displayRecipe = this.displayRecipe.bind(this);
      
    } // end constructor


    showNotes(){  // toggle state of notes textarea
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


    async displayRecipe(){
        // displays recipe either in new window or iframe in new page
        // check whether page can be opened in iframe before opening in iframe

        // TODO: i think this will do weird things if i close the main cookbook page while a recipe 
        // page is open and then re-open the cookbook page later - check
        let methodChanged = false;
        this.setState({
            notesDisabled: true,
        });
        if (this.recipe.method === "iframe") {  // open in iframe
            // make sure page can still be opened in iframe
            
            let iframeStillValidRequest = this.createRequest.createRequestWithBody('/api/checkIframe', 'POST', JSON.stringify({"link": this.recipe.recipeLink,
                                                                                                                                "nameId": this.recipe.nameId,
                                                                                                                                "chapter": this.props.chapter}));
            await fetch(iframeStillValidRequest).then(response=>response.json().then(json=>{
                if (json.method === 'new_window'){
                    this.recipe.method = json.method;
                    methodChanged = true;
                }
            })).catch(error=>{
                console.log(error);
            });

            if (methodChanged){  // can no longer open in iframe - send request to server to update asynchronously
                let changeOpeningMethodRequest = this.createRequest.createRequestWithBody('/api/updateRecipeMethod', 'POST', JSON.stringify({"link": this.recipe.recipeLink,
                                                                                                                                    "nameId": this.recipe.nameId,
                                                                                                                                    "chapter": this.props.chapter}));                                                                                  
                fetch(changeOpeningMethodRequest).catch((error)=>{
                    console.log(error);
                });
            }


            // go to recipe page
            if (this.recipe.method === "iframe") { // will still open in iframe
                let recipeWindow = window.open(`/recipe/${this.props.chapter}/${this.props.content.nameId}`);
                recipeWindow.addEventListener("unload", ()=>{
                    if (recipeWindow.location.href !== "about:blank"){
                        this.setState({
                            notesDisabled: false,
                            notes: recipeWindow.document.getElementsByTagName("textarea")[0].value
                        });
                        
                        this.notesWindow = null;
                    }
                });
            }
        } 

        if (this.recipe.method === "new_window") {  // open in new window
            console.log(this.notesWindow);
            let recipeWindow = window.open(this.props.content.recipeLink);
            if (this.notesWindow === null){  // only open notes window once
                this.notesWindow = window.open(`/notes/${this.props.chapter}/${this.props.content.nameId}`, "_blank", "height=300,width=300,location=0");
            }

            // is there a better way to do this?
            // listen for new window unload event to try to close notes window
            recipeWindow.addEventListener("unload", (event)=>{  // TODO: try to get this to work
                console.log(event);
                console.log(recipeWindow);
                console.log("new window should be closing");
                //notesWindow.close();
            });


            // add event listner to re-enable notes on main cookbook when notes window closes
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


    // return Draggable recipe that can be toggled to show notes
    render(){

        let chapter = this.props.chapter;
        let recipeId = this.props.content.nameId;

        return (
            <Draggable key={recipeId} draggableId={recipeId} index={this.props.index}>
                {(provided)=>(
                    <div className='recipe' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>
                            <li recipeType={this.props.content.method} chapterName={chapter} link={this.recipe.recipeLink} itemType="recipe" onClick={()=>{this.displayRecipe()}} onContextMenu={(event)=>{this.props.sendRightClick(event)}}>{this.recipe.name}</li>
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