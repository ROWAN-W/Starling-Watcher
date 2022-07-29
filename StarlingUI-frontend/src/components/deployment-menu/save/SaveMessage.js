import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { ProjectContext } from '../../App';
import logo from '../../img/load.gif';
const PROJECT_URL = 'http://localhost:8080/design/projects';

export default function SaveMessage(props) {

    const {projects, currentUserID, handleCurrentUser, setProjects, handleProjectSelect} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [dateModified, setDateModified] = useState();
    const [lastModifiedBy,setLastModifiedBy] = useState();
    const [error, setError] = useState(null);
    const [reLogin, setReLogin] = useState(false);

    useEffect(()=>{
        if(props.trigger===true){
            //data before saving
            console.log("data before saving");
            console.log(props.selectedProject.dateModified);
            console.log(props.selectedProject.lastModifiedBy);
            setDateModified(props.selectedProject.dateModified);
            setLastModifiedBy(props.selectedProject.lastModifiedBy);
            handleProjectSave();
        }
    },[props.trigger]);

    /*
        * contain at most 63 characters
        * contain only lowercase alphanumeric characters or '-'
        * start with an alphanumeric character
        * end with an alphanumeric character
     */

      function handleProjectSave(){
        if(props.selectedProject.saved===false){
          setIsPending(true);
          
          props.selectedProject.saved=true;
          let today = new Date();
          props.selectedProject.dateModified = today.toLocaleDateString()+' '+today.toLocaleTimeString();
          props.selectedProject.lastModifiedBy = currentUserID;

          putToServer(props.selectedProject.id,props.selectedProject);
        }
        else{
          console.log("already saved");
          setResult("The project is already saved");
        }
    }
    
      function putToServer(id,project){

        axios
        .put(PROJECT_URL+'/'+id, 
            JSON.stringify(project),
            {
                headers: { 
                    'Content-Type': 'application/json' ,
                },
            }, 
        )
        .then((data) => {
            setIsPending(false);
            setError(null);
            setResult("Your changes have been successfully saved"); 
            console.log("put "+PROJECT_URL+'/'+id);
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
            setIsPending(false);
            setResult('');
            //recover old data
            props.selectedProject.saved=false;
            props.selectedProject.dateModified = dateModified;
            props.selectedProject.lastModifiedBy = lastModifiedBy;   
            if(err.response.status===401){
                setError("Authentication is required. Please sign in again.");
                setReLogin(true);
            }
            //delete this project on the front-end
            else if(err.response.status===403){
              setError("Invalid project structure or ID. The project will be deleted automatically.");
              setProjects(projects.filter(project=>project.id!==id));
              handleProjectSelect(undefined);
            }
            else{
                setError(err.message);
            }
        });
        
      }

      function clearField(){
        setResult('');
        setIsPending(false);
        setError(null);
      }

      function authenticateAgain(){
        if(reLogin){
          handleCurrentUser(undefined);
          setReLogin(false);
        }
      }

    function message(){
        return(
            <>
            {savePending && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
            {!savePending && <button className='close' onClick={()=>{props.setTrigger(false);clearField();authenticateAgain()}}>&times;</button>}
            {error && <h2 className='title-error'>Save Project Error</h2>}
            {!error && result!=='' && <h2 className='title-success'>Success!</h2>}
            <div className='content'>{error? error: result}</div>
            {!savePending && 
            <div className='popup-footer normal'>
            <button className='btn short' onClick={()=>{props.setTrigger(false);clearField();authenticateAgain()}}>OK</button>
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
