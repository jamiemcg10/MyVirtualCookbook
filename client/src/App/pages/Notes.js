import React, { Component } from "react";
import Header from '../Components/Header.js';

class Notes extends Component {
    constructor(props){
        super(props);

        this.state = {
            notes: ''
        }

        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');


        // bind method
        this.getNotes = this.getNotes.bind(this);

        // get notes from db
        this.getNotes();

    }

    getNotes(){ 
        let getNotesRequest = this.createRequest.createRequest(`/api/recipe/notes/${this.props.match.params.chapter}/${this.props.match.params.recipeNameId}`, "GET");
        fetch(getNotesRequest).then(
            async (response) => {
                await response.json().then(
                    (json)=>{
                        this.setState({
                            notes: json.notes,
                        });
                    });
        }).catch((err)=>{
            console.log(err);
            throw err;
        });

    }
 


    render(){    
        let text = this.state.notes;
        let chapter = this.props.match.params.chapter;
        let recipeId = this.props.match.params.recipeNameId;

        return (
            <div clasName="notes-window">
                <Header type="mini-header" />
                <div className="notes-title">Notes: { this.props.match.params.chapter} &gt;&gt; { this.props.match.params.recipeNameId }</div>
                <textarea className="notes-popup" value={this.state.notes} onChange={(event)=>{this.accessNotes.updateNotes(event, chapter, recipeId); this.setState({notes: event.target.value});}}></textarea>

            </div>
        );
    }

}

export default Notes;