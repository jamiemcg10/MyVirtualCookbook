import React, { Component } from "react";
import Header from '../Components/Header.js';
import './styles/Notes.css'

class Notes extends Component {
    constructor(props){
        super(props);

        this.state = {
            notes: ''
        }

        // import modules
        this.createRequest = require('../modules/createRequest.js');
        this.accessNotes = require('../modules/accessNotes.js');

        // get notes from db
        this.getNotes();

    }

    getNotes = () => { 
        let getNotesRequest = this.createRequest.createRequest(`/api/recipe/notes/${this.props.match.params.chapter}/${this.props.match.params.recipeName}`, "GET");
        fetch(getNotesRequest).then(
            async (response) => {
                await response.json().then(
                    (json)=>{
                        this.setState({
                            notes: json.notes,
                        });
                    });
        }).catch((error)=>{
            let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error}));
            fetch(logErrorRequest);
        });

    }
 


    render(){    
        let chapter = this.props.match.params.chapter;
        let recipeName = this.props.match.params.recipeName;

        return (
            <div className="notes-window">
                <Header type="mini-header" />
                <div className="notes-title">Notes: { this.props.match.params.chapter} &gt;&gt; { recipeName }</div>
                <textarea className="notes-popup" value={this.state.notes} onChange={(event)=>{this.accessNotes.updateNotes(event, chapter, recipeName); this.setState({notes: event.target.value});}}></textarea>

            </div>
        );
    }

}

export default Notes;