import React, { useState } from 'react';
import DeleteWarning from './DeleteWarning';
import ProjectList from "./ProjectList";
import ShareProject from './ShareProject';
import SignOutWarning from '../SignOutWarning';
import Deploy from './Deploy';
import Upload from './Upload';

export default function Menu( {selectedProject,updateProjectToData, handleProjectAdd, handleProjectDelete, drones} ) {

    const [projectSelection, setProjectSelection] = useState(false);
    const [projectLoad, setProjectLoad] = useState(false);
    const [projectConfig, setProjectConfig] = useState(false);
    const [projectDeploy, setProjectDeploy] = useState(false);
    const [warning, setWarning] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);

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
        setProjectDeploy(clickEvent);
      }
    }

    function handleProjectLoad(clickEvent){
      setProjectLoad(clickEvent);
    }
    
  return (
    <>
    <button onClick={()=>handleProjectSelection(true)}>Select Project</button>
    <button onClick={()=>handleProjectAdd()}>Create Project</button>
    <button onClick={()=>handleProjectLoad(true)}>Load Project</button>
    <button onClick={()=>updateProjectToData()}>Save</button>
    <button onClick={()=>handleProjectDeploy(true)}>Deploy</button>
    <button onClick={()=>handleProjectConfig(true)}>Share</button>
    <button onClick={()=>handleProjectDelete(true)}>Delete</button>
    
    <ProjectList trigger={projectSelection} setTrigger={setProjectSelection}></ProjectList>
    <ShareProject trigger={projectConfig} setTrigger={setProjectConfig} selectedProject={selectedProject} setWarning={setWarning}></ShareProject>
    <SignOutWarning trigger={warning} setTrigger={setWarning} massage="Due to permission change, you will be logged out soon"></SignOutWarning>
    <DeleteWarning trigger={deleteWarning} setTrigger={setDeleteWarning} selectedProject={selectedProject}></DeleteWarning>
    <Deploy trigger={projectDeploy} setTrigger={setProjectDeploy} selectedProject={selectedProject} drones={drones} updateProjectToData={updateProjectToData}></Deploy>
    <Upload trigger={projectLoad} setTrigger={setProjectLoad}></Upload>
    </>
  )
}
