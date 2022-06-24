import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';

export default function SaveMessage(props) {

    const {projectsData, currentUserID} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);

    useEffect(()=>{
        if(checkBeforeSave()===true){
            //replace with Pench's
            const url = "http://localhost:8000/sampleProject";
            saveProjectToServer(url, props.selectedProject)
        }
    },[props.trigger]);

    function checkBeforeSave(){   
        if(props.selectedProject===undefined || props.selectedProject===null){
            return false;
        }     
        if(props.selectedProject.name===''){
          console.log("cannot save project name!");
          setResult("Please provide a project name.")
          return false;
        }
        for(let i=0;i<props.selectedProject.config.length;i++){
            if(props.selectedProject.config[i].name==''){
                console.log("cannot save node name!");
                setResult("Please provide a name for Master and each Deployment.")
                return false;
            }
        }
        return true;
    }

      function saveProjectToServer(url,updatedProject){
        if(updatedProject.saved===false){
          setIsPending(true);
          setResult("Please wait...");
          updatedProject.saved=true;
          let today = new Date();
          updatedProject.dateModified = today.toLocaleDateString()+' '+today.toLocaleTimeString();
          updatedProject.lastModifiedBy = currentUserID;
          const index = projectsData.findIndex(p=>p.id===updatedProject.id);
          if(index!==-1){
            console.log("when save: existing project");
            putToServer(url,updatedProject.id,updatedProject);
          }else{
            console.log("when save: new project");
            postToServer(url,updatedProject);
          }
        }else{
          console.log("already saved");
          setResult("The project is already saved");
        }
    }

      function postToServer(url,data){

        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data),
        };

        fetch(url,options)
        .then(res => {
        if (!res.ok) { // error coming back from server
            setResult('Error Details: '+res.status);
            return;
        } 
        return res.json();
        })
        .then(data => {
            setIsPending(false);
            setResult("Your project has been successfully saved"); //respond from Pench's server
            //setResult(data);
            console.log("post "+url);
        })
        .catch(err => {
            setIsPending(false);
            // auto catches network / connection error
            setResult(err.message);
        })
      }
    
      function putToServer(url,id,data){
        
        const options = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data),
        };

        fetch(url+'/'+id,options)
        .then(res => {
        if (!res.ok) { // error coming back from server
            setResult('Error Details: '+res.status);
            return;
        } 
        return res.json();
        })
        .then(data => {
            setIsPending(false);
            setResult("Your project has been successfully saved"); //respond from Pench's server
            //setResult(data);
            console.log("put "+url);
        })
        .catch(err => {
            setIsPending(false);
            // auto catches network / connection error
            setResult(err.message);
        })
      }

    function message(){
        return(
            <>
            {!savePending && <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setResult('')}}>&times;</button>}
            <p>{result}</p>
            <button onClick={()=>{props.setTrigger(false);setResult('')}}>OK</button>
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
