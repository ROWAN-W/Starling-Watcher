import React, {useContext, useState} from 'react';
import { ProjectContext } from '../../App';
import warning from '../../img/warning-svgrepo-com.svg';

export default function DeleteWarning(props) {

    const {currentUserID} = useContext(ProjectContext);

    function message(){
        if(currentUserID===props.selectedProject.ownerID){
            console.log("it's owner");
            return(
                <>
                <h2 className='title-error wordbreak wordwrap'><img className="warning" src={warning} alt="warning" />Delete {props.selectedProject.name}?</h2>
                <div className='content'>This action cannot be undone!</div>

                <div className='popup-footer normal'>
                <button className="btn btn-danger" onClick={()=>{props.setTrigger(false);props.setProjectDelete(true)}}>Still Delete</button>
                <button className="btn btn-cancel" onClick={()=>{props.setTrigger(false);}}>Cancel</button>
                </div>
                </>
            )
        }else{
            console.log("cannot delete");
            return(
                <>
                <h2 className='title-error'>Can't delete</h2>
                <div className='content'>Only owner can delete the project</div>
                <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false);}}>OK</button>
                </div>
                </>
            )
        }
    }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
            <button className='close' onClick={()=>props.setTrigger(false)}>&times;</button>

                {message()}
            </div>
        </div>
      ): ""
}
