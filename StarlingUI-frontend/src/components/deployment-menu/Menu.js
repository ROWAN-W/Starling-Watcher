import React, { useState,useContext, useEffect } from 'react';
import { ProjectContext } from '../App';
import DeleteWarning from './delete/DeleteWarning';
import DeleteProject from './delete/DeleteProject';
import ProjectList from "./select/ProjectList";
import ShareProject from './share/ShareProject';
import Deploy from './deploy/Deploy';
import Upload from './Upload';
import SaveMessage from './save/SaveMessage';
import DeployWarning from './deploy/DeployWarning';
import CreateProject from './CreateProject';
import SaveWarning from './save/SaveWarning';

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

    const [saveWarning, setSaveWarning] = useState(false);
    const [saveWarningMes, setSaveWarningMes] = useState('');

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
          setDeployWarningMes("Click \"Sync\" to sync available devices");
          setDeployWarning(clickEvent);
          return;
        }
        if(selectedProject.name===''){
          setDeployWarningMes("Please provide a project name");
          setDeployWarning(clickEvent);
          return;
        }else{
          for (let i = 0; i < selectedProject.name.length; i++) {
            let code = selectedProject.name.charCodeAt(i);
            if ((code !== 45) && // '-'
                !(code > 47 && code < 58) && // numeric (0-9)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                
                setDeployWarningMes("Project name can only contain lowercase alphanumeric characters or '-'")
                setDeployWarning(clickEvent);
                return;
            }
          }
          if(selectedProject.name.charCodeAt(0)===45 || selectedProject.name.charCodeAt(selectedProject.name.length-1)===45){
              setDeployWarningMes("Project name can only start/end with an alphanumeric character")
              setDeployWarning(clickEvent);
              return;
          }
        }
        let nameArray = [];
        for(let i=0;i<selectedProject.config.length;i++){
            if(selectedProject.config[i].containers.length===0){
                setDeployWarningMes("Please specify at least one image for Master and each Deployment.");
                setDeployWarning(clickEvent);
                return;
            }
            if(nameArray.includes(selectedProject.config[i].name)){
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
      const name = selectedProject.name;      
      if(name===''){
        console.log("cannot save project name!");
        setSaveWarning(true);
        setSaveWarningMes("Please provide a project name.")
        return;
      }
      else{
          for (let i = 0; i < name.length; i++) {
              let code = name.charCodeAt(i);
              if ((code !== 45) && // '-'
                  !(code > 47 && code < 58) && // numeric (0-9)
                  !(code > 96 && code < 123)) { // lower alpha (a-z)
                  
                  console.log("contain only lowercase alphanumeric characters or '-'!");
                  //setResult("Project name can only contain lowercase alphanumeric characters or '-'")
                  setSaveWarning(true);
                  setSaveWarningMes("Project name can only contain lowercase alphanumeric characters or '-'")
                  return;
              }
          }
          if(name.charCodeAt(0)===45 || name.charCodeAt(name.length-1)===45){
              console.log("start/end with an alphanumeric character");
              setSaveWarning(true);
              setSaveWarningMes("Project name can only start/end with an alphanumeric character")
              return;
          }
          setProjectSave(clickEvent);
      }
      }
    }

    function handleProjectCreate(clickEvent){
      if(currentUserID!==''){
        setProjectCreate(clickEvent);
      }
    }
    
  return (
    <>
    <div className='menu'>
    <button className='btn btn-menu' onClick={()=>handleProjectSelection(true)}>Select Project</button>
    <button className='btn btn-menu' onClick={()=>handleProjectCreate(true)}>Create Project</button>
    <button className='btn btn-menu' onClick={()=>handleProjectLoad(true)}>Load Project</button>
    <button className='btn btn-menu' onClick={()=>handleProjectDelete(true)}>Delete Project</button>
    <button className='btn btn-menu' onClick={()=>handleProjectSave(true)}>Save</button>
    <button className='btn btn-menu' onClick={()=>handleProjectConfig(true)}>Share</button>
    <button className='btn btn-menu btn-accent' onClick={()=>handleProjectDeploy(true)}>Deploy</button>
    </div>
    
    <ProjectList trigger={projectSelection} setTrigger={setProjectSelection}></ProjectList>
    <CreateProject trigger={projectCreate} setTrigger={setProjectCreate}></CreateProject>
    <SaveMessage trigger={projectSave} setTrigger={setProjectSave} 
    selectedProject={selectedProject}
    setSaveWarning={setSaveWarning}
    setSaveWarningMes={setSaveWarningMes}
    ></SaveMessage>
    <SaveWarning trigger={saveWarning} setTrigger={setSaveWarning} message={saveWarningMes}></SaveWarning>
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