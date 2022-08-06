import React, {useContext, useEffect} from 'react';
import { ProjectContext } from './App';

export default function RecoverMessage(props) {
    
    const {projects, handleProjectSelect} = useContext(ProjectContext);

    useEffect(()=>{
        //key friendly
        window.addEventListener('keydown', keyOperation);
            
        return () => { 
          window.removeEventListener('keydown', keyOperation);
        };
      },[]);
    
      function keyOperation(e){
        if(e.key==='Escape'||e.code==='Escape'){
            props.setTrigger(false);
        }
      }

    function message(){
        return(
            <>
            <h2 className='title-success wordbreak wordwrap'>Recover Unsaved Changes</h2>
            
                <div className='content'>
                    <ul className='unsaved-list'>Please save below projects soon:</ul>
                    {props.unsavedProjectIDs.map(projectID=>
                    <li className='unsaved-item wordbreak wordwrap' key={projectID} onClick={()=>{handleProjectSelect(projectID); props.setTrigger(false)}}>{projects.find(project=>project.id===projectID)?.name}</li>)}
                </div>
            <div className='key-hint'>(Press ESC to leave. Click project to open.)</div>
            <div className='popup-footer normal'>
            <button className='btn short' onClick={()=>{props.setTrigger(false);}}>OK</button>
            </div>
            </>
        )
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
