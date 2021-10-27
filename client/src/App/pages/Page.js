import fetch from "node-fetch";
import React, { Component, Fragment } from "react";
import Header from '../Components/Header.js';
import NotFound from '../pages/NotFound';
import './styles/Page.css'

// page that displays recipe and notes
//to replace recipe page
class Page extends Component {
    constructor(props){
        super(props);

        this.state = {
            notes: '',
            url: '',
            name: '',
            chapter: this.props.match.params.chapter,
            recipeName: this.props.match.params.recipeName,
            recipeIsValid: true
        };

        // import modules
        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');

    }

    componentDidMount(){
        // get recipe link and name and notes from db
        this.getRecipe();
    }

    getRecipe = () => {
        let getNotesRequest = this.createRequest.createRequest(`/api/recipe/${this.state.chapter}/${this.state.recipeName}`, "GET");
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
                        } else {
                            // can't get notes - use as proxy for recipe not being in cookbook
                            this.setState({
                                recipeIsValid: false
                            })
                        }
                    });
        }).catch((error)=>{
            let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
            fetch(logErrorRequest);
        });

    }


 

    render(){
        if (this.state.recipeIsValid){
            return (                
                <Fragment >
                    <Header />
                    <div className="page-notes-title">
                        { this.state.chapter} &gt;&gt; { this.state.name }
                    </div>
                    <div className="page-content">
                        <iframe src={this.state.url} title="recipe-frame"></iframe>
                        <textarea 
                            className="page-notes" 
                            value={this.state.notes} 
                            onChange={(event)=>{this.accessNotes.updateNotes(event, this.state.chapter, this.state.recipeName); this.setState({notes: event.target.value});}}
                        >
                        </textarea>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <NotFound />
            );
        }
    }

}

export default Page;