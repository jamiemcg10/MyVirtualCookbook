import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import notesImg from '../../Images/text-documents-line.png';

class Recipe extends Component{
    constructor(props){
        super(props);

        this.recipe = this.props.content;
        this.chapter = this.props.chapter;
        this.notesWindow = null;

        this.recipeWindow = null;

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
        this.handleNotesChange = this.handleNotesChange.bind(this);
      
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

        if (process.env.REACT_APP_CLASS_VERSION === "true"){ // always open in new window if for class
            this.recipe.method = "new_window";
        }

        if (this.recipe.method === "iframe") {  // open in iframe
            // make sure page can still be opened in iframe
            
            let iframeStillValidRequest = this.createRequest.createRequestWithBody('/api/checkIframe', 'POST', JSON.stringify({"link": this.recipe.recipeLink,
                                                                                                                                "name": this.recipe.name,
                                                                                                                                "chapter": this.props.chapter}));
            await fetch(iframeStillValidRequest).then(response=>response.json().then(json=>{
                if (json.method === 'new_window'){
                    this.recipe.method = json.method;
                    methodChanged = true;
                }
            })).catch(error=>{
                let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                fetch(logErrorRequest);
            });

            if (methodChanged){  // can no longer open in iframe - send request to server to update asynchronously
                let changeOpeningMethodRequest = this.createRequest.createRequestWithBody('/api/updateRecipeMethod', 'POST', JSON.stringify({"link": this.recipe.recipeLink,
                                                                                                                                    "nameId": this.recipe.nameId,
                                                                                                                                    "chapter": this.props.chapter}));                                                                                  
                fetch(changeOpeningMethodRequest).catch((error)=>{
                    let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
                    fetch(logErrorRequest);
                });
            }


            // go to recipe page
            if (this.recipe.method === "iframe") { // will still open in iframe
                if (this.recipeWindow === null){
                    this.recipeWindow = window.open(`/recipe/${this.props.chapter}/${this.props.content.name}`);

                    this.recipeWindow.addEventListener("unload", ()=>{
                        if (this.recipeWindow.location.href !== "about:blank"){
                            this.setState({
                                notesDisabled: false,
                                notes: this.recipeWindow.document.getElementsByTagName("textarea")[0].value
                            });
                            
                            this.notesWindow = null;
                            this.recipeWindow = null;
                        }
                    });
                } else {
                    this.recipeWindow.focus();
                }
            }
        } 

        if (this.recipe.method === "new_window") {  // open in new window
            window.open(this.props.content.recipeLink);
            if (this.notesWindow === null){  // only open notes window once
                this.notesWindow = window.open(`/notes/${this.props.chapter}/${this.props.content.name}`, "_blank", "height=300,width=375,location=0");
            }


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

    handleNotesChange(event){
        this.accessNotes.updateNotes(event, this.chapter, this.recipe.name); 
        this.setState({
            notes: event.target.value
        })
    }


    // return Draggable recipe that can be toggled to show notes
    render(){

        let chapter = this.props.chapter;
        let recipeId = this.props.content.nameId;
        let recipe = this.props.content;
        let dragId = `${chapter}-${recipeId}`;

        return (
            <Draggable key={recipeId} draggableId={dragId} index={this.props.index}>
                {(provided)=>(
                    <div className='recipe' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>
                            <a href={recipe.recipeLink} class="no-link-decoration"><li recipeType={this.props.content.method} chapterName={chapter} link={recipe.recipeLink} itemType="recipe" onClick={()=>{this.displayRecipe()}} onContextMenu={(event)=>{this.props.sendRightClick(event)}}>{recipe.name}</li></a>
                            <img alt="recipe-ico" className="recipe-icon" src={notesImg} onClick={()=>{this.showNotes()}}/>
                        </div>
                        <textarea className="cookbook-notes" notesOpen={this.state.notesOpen} disabled={this.state.notesDisabled} value={this.state.notes} onChange={this.handleNotesChange}></textarea>
                    </div>
                )}
            </Draggable>
        );
    }

}


export default Recipe;