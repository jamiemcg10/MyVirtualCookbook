import React, { Component } from 'react';
import $ from 'jquery';


// renders right click menu for cookbook
class CustomContextMenu extends Component {


    componentDidMount(){
        // highlight on mouseover, set props on click
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

        $('#rename').on("click", (event)=>{
            this.props.renameItem(true);
            console.log(this.props.renameItem);
        });
        
        $('#delete').on("click", (event)=>{
            this.props.deleteItem(true);
            console.log(this.props.deleteItem);
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