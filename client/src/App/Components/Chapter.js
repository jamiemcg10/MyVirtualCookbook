import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Recipe from './Recipe.js';

class Chapter extends Component{
    constructor(props){
        super(props);

        // create refs for manipulation
        this.chapterRef = React.createRef();
        this.recipesRef = React.createRef();

    } // end of constructor


    toggleChapter(){  // sets chapter open or closed
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

    // returns Droppable chapter with recipes mapped to Recipe components
    render(){
        let chapterExpanded;
        if (this.props.recipes.length === 0){  // if no recipes, don't show toggle 
            chapterExpanded="none";
        } else {  // otherwise expand chapter
            chapterExpanded="true";
        }


        return (
            <Droppable droppableId={this.props.name}>
                {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="droppable-div" >
                <li itemType="chapter" ref={this.chapterRef} chapterExpanded={chapterExpanded} onClick={()=>{this.toggleChapter();}}  onContextMenu={(event)=>{this.props.rightClick(event); event.preventDefault();}} >{this.props.name}</li>
                <ul ref={this.recipesRef} chapterOpen="true">
                    {this.props.recipes.map((recipe, index) => 
                        <Recipe content={recipe} key={recipe._id} chapter={this.props.name} index={ index } sendRightClick={(event)=>{this.props.rightClick(event); event.preventDefault();}}/>
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