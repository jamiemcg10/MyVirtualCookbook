import fetch from "node-fetch";
import React, { Component, Fragment } from "react";
import Header from '../Components/Header.js';

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

        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');
        this.getRecipe = this.getRecipe.bind(this);

        this.getRecipe();

    }

    getRecipe(){
        console.log(this.props.match.params);
        
        let getNotesRequest = this.createRequest.createRequest(`/api/recipe/${this.state.chapter}/${this.state.recipeId}`, "GET");
        fetch(getNotesRequest).then(
            async (response) => {
                console.log(`response: ${response}`);
                await response.json().then(
                    (json)=>{
                        console.log(json);
                        if (json.success){
                            this.setState({
                                notes: json.recipe.recipeNotes,
                                url: json.recipe.recipeLink,
                                name: json.recipe.name
                            });
                        }
                    });
        }).catch((err)=>{
            console.log(err);
            throw err;
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