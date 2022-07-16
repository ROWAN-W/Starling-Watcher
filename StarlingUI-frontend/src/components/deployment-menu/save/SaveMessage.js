import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../../App';
import logo from '../../img/load.gif';

export default function SaveMessage(props) {

    const {currentUserID} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [dateModified, setDateModified] = useState();
    const [lastModifiedBy,setLastModifiedBy] = useState();
    const [error, setError] = useState(null);

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
