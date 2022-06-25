import React, { useState,useEffect, useContext } from 'react';
import { ProjectContext } from '../App';

export default function DeleteProject(props) {
    
    const {projects, setProjects, setSelectedProjectID} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
    const [savePending, setIsPending] = useState(false);

    useEffect(()=>{
        if(props.trigger===true){
            handleProjectDelete();
        }
    },[props.trigger]);

    function handleProjectDelete(){
        if(props.selectedProject!==null){
            deleteToServer('http://localhost:8000/sampleProject',props.selectedProject.id);
        }
    }

    function deleteToServer(url,id){
        console.log("delete project in project delete!");
        setIsPending(true);
        fetch(url+'/'+id,{
            method: 'DELETE'
        })
        .then(res => {
        if (!res.ok) { // error coming back from server
            setResult('Error Details: '+res.status);
            return;
        } 
        return res.json();
        })
        .then(data => {
            setIsPending(false);
            setResult("Your project has been successfully deleted"); //respond from Pench's server
            //setResult(data);
            console.log("delete "+url);
            setProjects(projects.filter(project=>project.id!==id));
            setSelectedProjectID(undefined);
        })
        .catch(err => {
            setIsPending(false);
            // auto catches network / connection error
            setResult("Failed to connect to the server");
        })
      }


    function message(){
        return(
            <>
            {!savePending && <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setResult('Please wait...')}}>&times;</button>}
            <p>{result}</p>
            <button onClick={()=>{props.setTrigger(false);setResult('Please wait...')}}>OK</button>
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