import React, { Component } from 'react';
import $ from 'jquery';

class CustomContextMenu extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        $('#rename').on("mouseover", (event)=>{
            $('#rename').css("backgroundColor","blue");
          $('#rename').css("color","antiquewhite");
        });
        
        $('#rename').on("mouseout", (event)=>{
            $('#rename').css("backgroundColor","");
          $('#rename').css("color","");
        });
        
        $('#delete').on("mouseover", (event)=>{
            $('#delete').css("backgroundColor","blue");
          $('#delete').css("color","antiquewhite");
        });
        
        $('#delete').on("mouseout", (event)=>{
            $('#delete').css("backgroundColor","");
          $('#delete').css("color","");
        });
    }


render(){
    return(
        <div id="customContextMenu">
            <div id="rename" className="menu-item"><span>Rename</span></div>
            <div id="delete" className="menu-item"><span>Delete</span></div>
        </div>
    );
};


}  // end CustomContextMenu class


export default CustomContextMenu;