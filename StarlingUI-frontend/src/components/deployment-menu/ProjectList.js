import React,{useContext, useEffect} from 'react';
import { ProjectContext } from '../App';

export default function ProjectList(props) {
    
    const {userData, projects, handleProjectSelect} = useContext(ProjectContext);

    return (props.trigger) ? (
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
            <table>
            <thead>
            <tr>
                <th>Project Name</th>
                <th>Last Saved</th>
                <th>Last Saved by</th>
            </tr>
            </thead>
            <tbody>
            {projects?.map(project=>{
                return(
                    <tr 
                        key={project.id} 
                        onClick={()=>{handleProjectSelect(project.id); props.setTrigger(false)}}>
                        <td width="50%">{project.name}</td>
                        <td width="50%">{project.dateModified}</td>
                        <td width="50%">{userData.find(user=>user.id===project.lastModifiedBy).name}</td>
                    </tr>
                ) 
            })}
            </tbody>
            </table>
        </div>
    </div>
  ): ""
}
