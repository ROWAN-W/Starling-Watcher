import React, { useState } from 'react';
import DeleteWarning from './DeleteWarning';
import ProjectList from "./ProjectList";
import ShareProject from './ShareProject';
import SignOutWarning from '../SignOutWarning';
import Deploy from './deploy/Deploy';
import Upload from './Upload';
import SaveMessage from './SaveMessage';
import DeployMessage from './deploy/DeployMessage';

export default function Menu( {selectedProject,updateProjectToData, handleProjectAdd, handleProjectDelete, drones, handleUpdateTime, updateTime, updateMes} ) {

    const [projectSelection, setProjectSelection] = useState(false);
    const [projectSave, setProjectSave] = useState(false);
    const [projectLoad, setProjectLoad] = useState(false);
    const [projectConfig, setProjectConfig] = useState(false);
    const [projectDeploy, setProjectDeploy] = useState(false);
    const [warning, setWarning] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);
    
    const [deployWarning, setDeployWarning] = useState(false);
    const [deployWarningMes, setDeployWarningMes] = useState('');

    function handleProjectSelection(clickEvent){
        setProjectSelection(clickEvent);
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
          console.log("cannot deploy without available drones!");
          setDeployWarningMes("No available drones to deploy.");
          setDeployWarning(true);
          return;
        }
        if(selectedProject.name===''){
          console.log("cannot deploy without project name!");
          setDeployWarningMes("Please provide a project name.");
          setDeployWarning(true);
          return;
        }
        let nameArray = [];
        for(let i=0;i<selectedProject.config.length;i++){
            if(selectedProject.config[i].containers.length===0){
                console.log("cannot deploy without images!");
                setDeployWarningMes("Please specify at least one image for Master and each Deployment.");
                setDeployWarning(true);
                return;
            }
            if(selectedProject.config[i].name==''){
                console.log("cannot deploy without node name!");
                setDeployWarningMes("Please provide a name for Master and each Deployment.");
                setDeployWarning(true);
                return;
            }
            if(nameArray.includes(selectedProject.config[i].name)){
                console.log("cannot deploy without duplicate node name!");
                setDeployWarningMes("Please provide an unique name for Master and each Deployment.");
                setDeployWarning(true);
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
    
  return (
    <>
    <button onClick={()=>handleProjectSelection(true)}>Select Project</button>
    <button onClick={()=>handleProjectAdd()}>Create Project</button>
    <button onClick={()=>handleProjectLoad(true)}>Load Project</button>
    <button onClick={()=>handleProjectSave(true)}>Save</button>
    <button onClick={()=>handleProjectDeploy(true)}>Deploy</button>
    <button onClick={()=>handleProjectConfig(true)}>Share</button>
    <button onClick={()=>handleProjectDelete(true)}>Delete</button>
    
    <ProjectList trigger={projectSelection} setTrigger={setProjectSelection}></ProjectList>
    <SaveMessage trigger={projectSave} setTrigger={setProjectSave} selectedProject={selectedProject}></SaveMessage>
    <ShareProject trigger={projectConfig} setTrigger={setProjectConfig} selectedProject={selectedProject} setWarning={setWarning}></ShareProject>
    <SignOutWarning trigger={warning} setTrigger={setWarning} massage="Due to permission change, you will be logged out soon"></SignOutWarning>
    <DeleteWarning trigger={deleteWarning} setTrigger={setDeleteWarning} selectedProject={selectedProject}></DeleteWarning>
    <Deploy trigger={projectDeploy} setTrigger={setProjectDeploy} 
    selectedProject={selectedProject} updateProjectToData={updateProjectToData} 
    drones={drones} handleUpdateTime={handleUpdateTime} updateTime={updateTime} updateMes ={updateMes}
    ></Deploy>
    <DeployMessage trigger={deployWarning} setTrigger={setDeployWarning} message={deployWarningMes}></DeployMessage>
    <Upload trigger={projectLoad} setTrigger={setProjectLoad}></Upload>
    </>
  )
}