import React, {useContext} from 'react';
import { ProjectContext } from '../App';

export default function UnsavedWarning(props) {
    
    const {projects, handleCurrentUser, handleProjectSelect} = useContext(ProjectContext);

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
                <h3>Unsaved Changes</h3>
                <p>{props.unsavedProjectIDs.length} unsaved projects:
                {props.unsavedProjectIDs.map(projectID=>
                    <li key={projectID} onClick={()=>{handleProjectSelect(projectID); props.setTrigger(false)}}>{projects.find(project=>project.id===projectID)?.name}</li>)}
                </p>
                <p>Signing out will lose all unsaved changes.<br></br>Are you sure you want to sign out?</p>
                <button onClick={()=>{props.setTrigger(false);handleCurrentUser(undefined)}}>Still Sign Out</button>
            </div>
        </div>
      ): ""
}
