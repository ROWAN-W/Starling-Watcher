import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import logo from '../img/load.gif';

export default function CreateProject(props) {
    
    const {projects, currentUserID, setProjects, handleProjectSelect} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(props.trigger===true){
            handleProjectAdd();
        }
    },[props.trigger]);

    function handleProjectAdd(){  
        const masterId = uuidv4();
        const number = projects.length+1;

        const newProject = {
        id: "",
        name: 'project-'+number,
        dateModified: new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString(),
        lastModifiedBy: currentUserID,
        saved: true,
        ownerID: currentUserID,
        memberIDs: [currentUserID],
        config:[
          {
            id:masterId,
            name: 'design',
            kind: 'master',
            //can be empty
            label: 
              {
                app: 'project-'+number,
                platform: ''
              }
            ,
            containers:[]    
          },
        ],
        mapping:[
          {
            nodeID: masterId,
            mappedDrones: []
          }
        ]
      }
        console.log("add project in create project!");
        setIsPending(true);
        postToServer('http://localhost:8080/design/projects',newProject);
        }
      
      function postToServer(url,project){
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(project),
        };
        
        fetch(url,options)
        .then(res => {
        if (!res.ok) { // error coming back from server
            throw Error('Error Details: '+res.status);
        } 
        return res.json();
        })
        .then(data => { //id
            setIsPending(false);
            setError(null);
            setResult("Your project has been successfully created and saved"); //respond from Pench's server
            //setResult(data);
            console.log("post "+url);
            console.log(data);
            project.id = data.id; //id from db {"id": "62c04445cda4856fc0226778"}
            setProjects([...projects,project]);
            handleProjectSelect(data.id); 
        })
        .catch(err => { // auto catches network / connection error
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
//