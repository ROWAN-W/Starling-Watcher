import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

export default function CreateProject(props) {
    
    const {projects, currentUserID, setProjects, handleProjectSelect} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
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
        name: 'New Project['+number+']',
        dateModified: new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString(),
        lastModifiedBy: currentUserID,
        saved: true,
        ownerID: currentUserID,
        memberIDs: [currentUserID],
        config:[
          {
            id:masterId,
            name: 'new design',
            kind: 'master',
            label: 
              {
                app: 'starling',
                platform: 'pixhawk'
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