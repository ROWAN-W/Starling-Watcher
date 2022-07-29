import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import logo from '../img/load.gif';
const PROJECT_URL = 'http://localhost:8080/design/projects';

export default function CreateProject(props) {
    
    const {projects, currentUserID, setProjects, handleProjectSelect,handleCurrentUser} = useContext(ProjectContext);

    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [reLogin, setReLogin] = useState(false);

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
        postToServer(newProject);
        }
      
      function postToServer(project){

        axios
        .post(PROJECT_URL, 
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
          setResult("Your project has been successfully created and saved");
          console.log("post "+PROJECT_URL);
          console.log(data.data.id);
          project.id = data.data.id; //id from db {"id": "62c04445cda4856fc0226778"}
          setProjects([...projects,project]);
          handleProjectSelect(data.data.id); 
        })
        .catch((err) => {
          console.log(err.message);
          setIsPending(false);
          setResult('');
          if(err.response.status===401){
              setError("Authentication is required. Please sign in again.");
              setReLogin(true);
          }
          else if(err.response.status===403){
            setError("Invalid project structure. Please try again.");
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
          {error && <h2 className='title-error'>Create Project Error</h2>}
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
//