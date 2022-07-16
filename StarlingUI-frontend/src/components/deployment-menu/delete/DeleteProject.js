import React, { useState,useEffect, useContext } from 'react';
import { ProjectContext } from '../../App';
import logo from '../../img/load.gif';

export default function DeleteProject(props) {
    
    const {projects, setProjects, handleProjectSelect} = useContext(ProjectContext);

    const [result, setResult] = useState('');
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

      function clearField(){
        setResult('');
        setIsPending(false);
        setError(null);
      }


    function message(){
        return(
            <>
            {savePending && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
            {!savePending && <button className='close' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>}
            {error && <h2 className='title-error'>Error!</h2>}
            {!error && result!=='' && <h2 className='title-success'>Success!</h2>}
            <div className='content'>{error? error: result}</div>
            {!savePending && 
            <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false);clearField()}}>OK</button>
            </div>}
            
            
            </>
        )
    }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
                {message()}
            </div>
        </div>
      ): ""
}