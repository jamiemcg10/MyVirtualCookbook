import fetch from "node-fetch";
import React, { Component, Fragment } from "react";
import Header from '../Components/Header.js';

// page that displays recipe and notes
class Recipe extends Component {
    constructor(props){
        super(props);

        this.state = {
            notes: '',
            url: '',
            name: '',
            chapter: this.props.match.params.chapter,
            recipeId: this.props.match.params.recipeNameId,
        };

        // import modules
        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');
        
        // bind method
        this.getRecipe = this.getRecipe.bind(this);

        // get recipe link and name and notes from db
        this.getRecipe();

    }

    getRecipe(){
        let getNotesRequest = this.createRequest.createRequest(`/api/recipe/${this.state.chapter}/${this.state.recipeId}`, "GET");
        fetch(getNotesRequest).then(
            async (response) => {
                await response.json().then(
                    (json)=>{
                        if (json.success){  // request for recipe successful, set state to reload
                            this.setState({
                                notes: json.recipe.recipeNotes,
                                url: json.recipe.recipeLink,
                                name: json.recipe.name
                            });
                        }
                    });
        }).catch((error)=>{
            let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST". JSON.stringify({text: error}));
            fetch(logErrorRequest);
        });

    }


 

    render(){
        return (
            <Fragment >
                <Header />
                <div className="notes-title">{ this.state.chapter} &gt;&gt; { this.state.name }</div>
                <iframe src={this.state.url}></iframe>
                <div className="notes-pane">
                    <textarea id="notes-pane" value={this.state.notes} onChange={(event)=>{this.accessNotes.updateNotes(event, this.state.chapter, this.state.recipeId); this.setState({notes: event.target.value});}}></textarea>
                </div>
            </Fragment>

        );
    }

}

export default Recipe;