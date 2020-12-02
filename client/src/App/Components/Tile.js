import React, { Component } from 'react';
import addImg from '../../Images/Add.png';
import organizeImg from '../../Images/Organize.png';
import notesImg from '../../Images/Take Notes.png';

// used for homepage tiles
class Tile extends Component {
    constructor(props){
        super(props);
        if (this.props.title === 'Add recipes'){
            this.srcLoc = addImg;
        } else if (this.props.title === 'Organize'){
            this.srcLoc = organizeImg;
        } else if (this.props.title === 'Take notes'){
            this.srcLoc = notesImg;
        }
    }

    render(){
        return(
            <div className="tile"><img src={ this.srcLoc }/><br/><p>{this.props.title}</p></div>
        );
    }

}

export default Tile;