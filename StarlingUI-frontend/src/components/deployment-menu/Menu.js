import React, { useState,useContext, useEffect } from 'react';
import { ProjectContext } from '../App';
import DeleteWarning from './DeleteWarning';
import DeleteProject from './DeleteProject';
import ProjectList from "./ProjectList";
import ShareProject from './share/ShareProject';
import Deploy from './deploy/Deploy';
import Upload from './Upload';
import SaveMessage from './SaveMessage';
import DeployWarning from './deploy/DeployWarning';
import CreateProject from './CreateProject';

export default function Menu( {selectedProject, drones, handleUpdateTime, updateTime, error, waiting, minimize, setMinimize} ) {

  const {currentUserID} = useContext(ProjectContext);

    const [projectSelection, setProjectSelection] = useState(false);
    const [projectCreate, setProjectCreate] = useState(false);
    const [projectSave, setProjectSave] = useState(false);
    const [projectLoad, setProjectLoad] = useState(false);
    const [projectConfig, setProjectConfig] = useState(false);
    const [projectDeploy, setProjectDeploy] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [projectDelete, setProjectDelete] = useState(false);
    
    const [deployWarning, setDeployWarning] = useState(false);
    const [deployWarningMes, setDeployWarningMes] = useState('');

    useEffect(()=>{
      if(minimize===false){
          //resume Deploy window
          console.log("resume window")
          handleProjectDeploy(true);
      }
    },[minimize]);

    function handleProjectSelection(clickEvent){
      if(currentUserID!==''){
        setProjectSelection(clickEvent);
      }
    }

    function handleProjectConfig(clickEvent){
      if(selectedProject!==undefined){
        setProjectConfig(clickEvent);
      }
    }

    function handleProjectDelete(clickEvent){
      if(selectedProject!==undefined){
        setDeleteWarning(clickEvent);
      }
    }

    function handleProjectDeploy(clickEvent){
      if(selectedProject!==undefined){
        console.log(drones);

        //checking before deploying
        if(drones===null||drones===undefined||drones.length===0){
          console.log("cannot deploy without available devices!");
          setDeployWarningMes("No available devices to deploy. Click \"Sync Again\" to sync available devices");
          setDeployWarning(clickEvent);
          return;
        }
        if(selectedProject.name===''){
          console.log("cannot deploy without project name!");
          setDeployWarningMes("Please provide a project name.");
          setDeployWarning(clickEvent);
          return;
        }
        let nameArray = [];
        for(let i=0;i<selectedProject.config.length;i++){
            if(selectedProject.config[i].containers.length===0){
                console.log("cannot deploy without images!");
                setDeployWarningMes("Please specify at least one image for Master and each Deployment.");
                setDeployWarning(clickEvent);
                return;
            }
            if(selectedProject.config[i].name==''){
                console.log("cannot deploy without node name!");
                setDeployWarningMes("Please provide a name for Master and each Deployment.");
                setDeployWarning(clickEvent);
                return;
            }
            if(nameArray.includes(selectedProject.config[i].name)){
                console.log("cannot deploy without duplicate node name!");
                setDeployWarningMes("Please provide an unique name for Master and each Deployment.");
                setDeployWarning(clickEvent);
                return;
            }
            nameArray = [...nameArray,selectedProject.config[i].name];
        }
        console.log("you can deploy")
        setProjectDeploy(clickEvent);
      }
    }

    function handleProjectLoad(clickEvent){
      setProjectLoad(clickEvent);
    }

    function handleProjectSave(clickEvent){
      if(selectedProject!==undefined){
        setProjectSave(clickEvent);
      }
    }

    function handleProjectCreate(clickEvent){
      if(currentUserID!==''){
        setProjectCreate(clickEvent);
      }
    }
    
  return (
    <>
    <button onClick={()=>handleProjectSelection(true)}>Select Project</button>
    <button onClick={()=>handleProjectCreate(true)}>Create Project</button>
    <button onClick={()=>handleProjectLoad(true)}>Load Project</button>
    <button onClick={()=>handleProjectSave(true)}>Save</button>
    <button onClick={()=>handleProjectDeploy(true)}>Deploy</button>
    <button onClick={()=>handleProjectConfig(true)}>Share</button>
    <button onClick={()=>handleProjectDelete(true)}>Delete</button>
    
    <ProjectList trigger={projectSelection} setTrigger={setProjectSelection}></ProjectList>
    <CreateProject trigger={projectCreate} setTrigger={setProjectCreate}></CreateProject>
    <SaveMessage trigger={projectSave} setTrigger={setProjectSave} selectedProject={selectedProject}></SaveMessage>
    <ShareProject trigger={projectConfig} setTrigger={setProjectConfig} selectedProject={selectedProject}></ShareProject>
    <DeleteWarning trigger={deleteWarning} setTrigger={setDeleteWarning} setProjectDelete={setProjectDelete} selectedProject={selectedProject}></DeleteWarning>
    <DeleteProject trigger={projectDelete} setTrigger={setProjectDelete} selectedProject={selectedProject}></DeleteProject>
    <Deploy trigger={projectDeploy} setTrigger={setProjectDeploy} 
    selectedProject={selectedProject} 
    drones={drones} handleUpdateTime={handleUpdateTime} updateTime={updateTime} 
    error = {error} waiting = {waiting}
    minimize = {minimize} setMinimize = {setMinimize}
    ></Deploy>
    <DeployWarning trigger={deployWarning} setTrigger={setDeployWarning} message={deployWarningMes}></DeployWarning>
    <Upload trigger={projectLoad} setTrigger={setProjectLoad}></Upload>
    </>
  )
}