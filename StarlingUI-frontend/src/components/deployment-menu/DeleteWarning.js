import React, {useContext} from 'react';
import { ProjectContext } from '../App';

export default function DeleteWarning(props) {

    const {currentUserID,handleProjectDelete} = useContext(ProjectContext);

    function message(){
        if(currentUserID===props.selectedProject.ownerID){
            console.log("it's owner");
            return(
                <>
                <p>Are you sure you want to delete the project?</p>
                <button onClick={()=>{props.setTrigger(false);handleProjectDelete(props.selectedProject.id)}}>Confirm</button>
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
                {message()}
            </div>
        </div>
      ): ""
}
