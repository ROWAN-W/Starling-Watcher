import React, {useContext} from 'react';
import { ProjectContext } from '../App';
import warning from '../img/warning-svgrepo-com.svg';

export default function UnsavedWarning(props) {
    
    const {projects, handleCurrentUser, handleProjectSelect} = useContext(ProjectContext);

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
            <button className='close' onClick={()=>props.setTrigger(false)}>&times;</button>
            <h2 className='title-error'><img className="warning" src={warning} alt="warning" />Unsaved Changes</h2>
                
                <div>
                    <ul className='unsaved-list'>{props.unsavedProjectIDs.length} unsaved projects:</ul>
                    {props.unsavedProjectIDs.map(projectID=>
                    <li className='unsaved-item wordbreak wordwrap' key={projectID} onClick={()=>{handleProjectSelect(projectID); props.setTrigger(false)}}>{projects.find(project=>project.id===projectID)?.name}</li>)}
                </div>

                <div className='content'>Signing out will lose all unsaved changes.</div>
                
                <div className='popup-footer normal'>
                <button className="btn btn-danger" onClick={()=>{props.setTrigger(false);handleCurrentUser(undefined)}}>Still Sign Out</button>
                <button className="btn btn-cancel" onClick={()=>{props.setTrigger(false);}}>Cancel</button>
                </div>
            </div>
        </div>
      ): ""
}
