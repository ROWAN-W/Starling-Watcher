import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';

export default function SaveMessage(props) {

    const {currentUserID} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
    const [savePending, setIsPending] = useState(false);
    const [dateModified, setDateModified] = useState();
    const [lastModifiedBy,setLastModifiedBy] = useState();
    const [error, setError] = useState(null);

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

    /*
        * contain at most 63 characters
        * contain only lowercase alphanumeric characters or '-'
        * start with an alphanumeric character
        * end with an alphanumeric character
     */

    function checkBeforeSave(){   
        if(props.selectedProject===undefined || props.selectedProject===null){
            return false;
        }
        const name = props.selectedProject.name;      
        if(name===''){
          console.log("cannot save project name!");
          setResult("Please provide a project name.")
          return false;
        }
        else{
            for (let i = 0; i < name.length; i++) {
                let code = name.charCodeAt(i);
                if ((code !== 45) && // '-'
                    !(code > 47 && code < 58) && // numeric (0-9)
                    !(code > 96 && code < 123)) { // lower alpha (a-z)
                    
                    console.log("contain only lowercase alphanumeric characters or '-'!");
                    setResult("Project name can only contain lowercase alphanumeric characters or '-'")
                    return false;
                }
            }
            if(name.charCodeAt(0)===45 || name.charCodeAt(name.length-1)===45){
                console.log("start/end with an alphanumeric character");
                setResult("Project name can only start/end with an alphanumeric character")
                return false;
            }
            return true;
        }
    }

      function handleProjectSave(){
        if(props.selectedProject.saved===false){
          setIsPending(true);
          const url = "http://localhost:8080/design/projects"; 
          
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
            //recover old data
            props.selectedProject.saved=false;
            props.selectedProject.dateModified = dateModified;
            props.selectedProject.lastModifiedBy = lastModifiedBy;        
            throw Error('Error Details: '+res.status);
        } 
        return res.json();
        })
        .then(data => {
            setIsPending(false);
            setError(null);
            setResult("Your changes have been successfully saved"); //respond from Pench's server
            //setResult(data);
            console.log("put "+url);
            console.log(data);
        })
        .catch(err => {
            setIsPending(false);
            setError(err.message);
            setResult('');
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
