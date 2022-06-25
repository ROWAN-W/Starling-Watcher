import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';

export default function SaveMessage(props) {

    const {currentUserID} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
    const [savePending, setIsPending] = useState(false);
    const [dateModified, setDateModified] = useState();
    const [lastModifiedBy,setLastModifiedBy] = useState();

    useEffect(()=>{
        if(props.trigger===true && checkBeforeSave()===true){
            //data before saving
            console.log("data before saving");
            console.log(props.selectedProject.dateModified);
            console.log(props.selectedProject.lastModifiedBy);
            setDateModified(props.selectedProject.dateModified);
            setLastModifiedBy(props.selectedProject.lastModifiedBy);
            handleProjectSave();
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

      function handleProjectSave(){
        if(props.selectedProject.saved===false){
          setIsPending(true);
          const url = "http://localhost:8000/sampleProject"; //replace with Pench's
          
          props.selectedProject.saved=true;
          let today = new Date();
          props.selectedProject.dateModified = today.toLocaleDateString()+' '+today.toLocaleTimeString();
          props.selectedProject.lastModifiedBy = currentUserID;

          putToServer(url,props.selectedProject.id,props.selectedProject);
        }else{
          console.log("already saved");
          setResult("The project is already saved");
        }
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

            //recover old data
            props.selectedProject.saved=false;
            props.selectedProject.dateModified = dateModified;
            props.selectedProject.lastModifiedBy = lastModifiedBy;        
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
            setResult("Failed to connect to the server");
            //recover old data
            props.selectedProject.saved=false;
            props.selectedProject.dateModified = dateModified;
            props.selectedProject.lastModifiedBy = lastModifiedBy;   
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
