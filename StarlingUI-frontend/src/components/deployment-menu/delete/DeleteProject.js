import React, { useState,useEffect, useContext } from 'react';
import axios from "axios";
import { ProjectContext } from '../../App';
import logo from '../../img/load.gif';
const PROJECT_URL = 'http://localhost:8080/design/projects';

export default function DeleteProject(props) {
    
    const {projects, setProjects, handleProjectSelect, handleCurrentUser} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [reLogin, setReLogin] = useState(false);

    useEffect(()=>{
        if(props.trigger===true){
            handleProjectDelete();
        }
    },[props.trigger]);

    function handleProjectDelete(){
        if(props.selectedProject!==null){
            setIsPending(true);
            console.log("delete project in project delete!");
            deleteToServer(props.selectedProject.id);
        }
    }

    function deleteToServer(id){

        axios
        .delete(PROJECT_URL+'/'+id)
        .then((data) => {
            setIsPending(false);
            setError(null);
            setResult("Your project has been successfully deleted");
            console.log("delete "+PROJECT_URL+'/'+id);
            console.log(data);
            setProjects(projects.filter(project=>project.id!==id));
            handleProjectSelect(undefined);
        })
        .catch((err) => {
            console.log(err.message);
            setIsPending(false);
            setResult('');
            if(err.response.status===401){
                setError("Authentication is required. Please sign in again.");
                setReLogin(true);
            }
            //delete this project on the front-end
            else if(err.response.status===403){
                setError("Invalid project ID. The project will be deleted automatically.");
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
            {error && <h2 className='title-error'>Delete Project Error</h2>}
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