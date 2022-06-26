import React, {useContext, useState} from 'react';
import { ProjectContext } from '../App';

export default function DeleteWarning(props) {

    const {currentUserID} = useContext(ProjectContext);

    function message(){
        if(currentUserID===props.selectedProject.ownerID){
            console.log("it's owner");
            return(
                <>
                <p>Are you sure you want to delete {props.selectedProject.name}?<br></br>This action cannot be undone!</p>
                <button onClick={()=>{props.setTrigger(false);props.setProjectDelete(true)}}>Confirm</button>
                <button onClick={()=>{props.setTrigger(false);}}>Cancel</button>
                </>
            )
        }else{
            console.log("cannot delete");
            return(
                <>
                <p>Only owner can delete the project.</p>
                <button onClick={()=>{props.setTrigger(false);}}>OK</button>
                </>
            )
        }
    }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
            <h3>Delete Project</h3>
                {message()}
            </div>
        </div>
      ): ""
}
