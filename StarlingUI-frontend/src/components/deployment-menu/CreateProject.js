import React, { useEffect, useState, useContext } from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

export default function CreateProject(props) {
    
    const {projects, currentUserID, setProjects, setSelectedProjectID} = useContext(ProjectContext);

    const [result, setResult] = useState('Please wait...');
    const [savePending, setIsPending] = useState(false);

    useEffect(()=>{
        if(props.trigger===true){
            handleProjectAdd();
        }
    },[props.trigger]);

    function handleProjectAdd(){  
        const masterId = uuidv4();
        const number = projects.length+1;

        const newProject = {
        id: uuidv4(),
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
        //replace with Pench's
        postToServer('http://localhost:8000/sampleProject',newProject);
        }
      
      function postToServer(url,data){
        setIsPending(true);
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
            setResult("Your project has been successfully created and saved"); //respond from Pench's server
            //setResult(data);
            console.log("post "+url);
            setProjects([...projects,data]);
            setSelectedProjectID(data.id);
        })
        .catch(err => {
            setIsPending(false);
            // auto catches network / connection error
            setResult('Failed to connect to the server');
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