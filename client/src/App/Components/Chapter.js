import React, { Component, Fragment } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import $ from 'jquery';
import Recipe from './Recipe.js';

class Chapter extends Component{
    constructor(props){
        super(props);
        this.chapterRef = React.createRef();
        this.recipesRef = React.createRef();

        //this.createRequest = require('../modules/createRequest.js');
    } // end of constructor


    // componentDidMount(){
    //     $('li').on("click", (event)=>{
    //         console.log(event);
    //     });
        
    // }

    toggleChapter(){
        const recipesNode = this.recipesRef.current;
        const chapterNode = this.chapterRef.current;

        if (chapterNode.getAttribute("chapterExpanded") === "true"){
            recipesNode.setAttribute("chapterOpen", "false");
            chapterNode.setAttribute("chapterExpanded", "false");
        } else if (chapterNode.getAttribute("chapterExpanded") === "false"){
            recipesNode.setAttribute("chapterOpen", "true");
            chapterNode.setAttribute("chapterExpanded", "true");
        }
    }

    render(){
        let chapterExpanded;
        if (this.props.recipes.length === 0){
            chapterExpanded="none";
        } else {
            chapterExpanded="false";
        }

        console.log(this.props.recipes);

        return (
            <Droppable droppableId={this.props.name}>
                {(provided) => (
            <div  {...provided.droppableProps} ref={provided.innerRef}>
                <li itemType="chapter" ref={this.chapterRef} chapterExpanded={chapterExpanded} onClick={()=>{this.toggleChapter();}}  onContextMenu={(event)=>{this.props.rightClick(event); event.preventDefault();}} >{this.props.name}</li>
                <ul ref={this.recipesRef} chapterOpen="false">
                    {this.props.recipes.map((recipe, index) => 
                        <Recipe content={recipe} key={recipe._id} chapter={this.props.name} index={`${this.props.index}${index}`} sendRightClick={(event)=>{this.props.rightClick(event); event.preventDefault();}}/>
                    )}
                {provided.placeholder}
                </ul>
            </div>
            )}
            </Droppable>
        );
    }

}


export default Chapter;