import React, { useState,useEffect, useContext } from 'react';
import { ProjectContext } from '../App';

export default function DeleteProject(props) {
    
    const {projects, setProjects, handleProjectSelect} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
    const [savePending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(props.trigger===true){
            handleProjectDelete();
        }
    },[props.trigger]);

    function handleProjectDelete(){
        if(props.selectedProject!==null){
            setIsPending(true);
            deleteToServer('http://localhost:8080/design/projects',props.selectedProject.id);
        }
    }

    function deleteToServer(url,id){
        console.log("delete project in project delete!");
        console.log();
        fetch(url+'/'+id,{
            method: 'DELETE'
        })
        .then(res => {
        if (!res.ok) { // error coming back from server
            throw Error('Error Details: '+res.status);
        } 
        return res.json();
        })
        .then(data => {
            setIsPending(false);
            setError(null);
            setResult("Your project has been successfully deleted"); //respond from Pench's server
            //setResult(data);
            console.log("delete "+url);
            console.log(data);
            setProjects(projects.filter(project=>project.id!==id));
            handleProjectSelect(undefined);
        })
        .catch(err => {
            setIsPending(false);
            setError(err.message);
            setResult('');
        })
      }


    function message(){
        return(
            <>
            {!savePending && <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setResult('Please wait...')}}>&times;</button>}
            <p>{error? error: result}</p>
            {!savePending && <button onClick={()=>{props.setTrigger(false);setResult('Please wait...')}}>OK</button>}
            </>
        )
    }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                {message()}
            </div>
        </div>
      ): ""
}