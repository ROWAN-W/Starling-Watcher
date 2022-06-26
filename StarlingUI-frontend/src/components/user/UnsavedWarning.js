import React, {useContext} from 'react';
import { ProjectContext } from '../App';

export default function UnsavedWarning(props) {
    
    const {handleCurrentUser} = useContext(ProjectContext);

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
                <h3>Unsaved Changes</h3>
                <p>{props.unsavedProjectNames.length} unsaved projects:
                {props.unsavedProjectNames.map(projectName=><li key={projectName}>{projectName}</li>)}
                </p>
                <p>Signing out will lose all unsaved changes.<br></br>Are you sure you want to sign out?</p>
                <button onClick={()=>{props.setTrigger(false);handleCurrentUser(undefined)}}>Sign Out</button>
            </div>
        </div>
      ): ""
}
