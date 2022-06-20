import React,{useContext, useEffect} from 'react';
import { ProjectContext } from '../App';

export default function ProjectList(props) {
    
    const {currentUserID, users, projects, handleProjectSelect} = useContext(ProjectContext);

    useEffect(()=>{
        console.log("rendered in projectList");
      },[currentUserID]);

    return (props.trigger) ? (
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
            <div className='popup-projects-title'>
                <span>Project Name&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>Last Modified</span>
            </div>
            {projects?.map(project=>{
                return(
                    <div 
                        key={project.id} 
                        onClick={()=>{handleProjectSelect(project.id); props.setTrigger(false)}}>
                        <span>{project.name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{project.dateModified}</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;{users.find(user=>user.id===project.lastModifiedBy).name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                ) 
            })}
        </div>
    </div>
  ): ""
}
