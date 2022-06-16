import React, { useState } from 'react';
import DeleteWarning from './DeleteWarning';
import ProjectList from "./ProjectList";
import ShareProject from './ShareProject';
import SignOutWarning from './SignOutWarning';

export default function Menu( {selectedProject,updateProjectToData, handleProjectAdd, handleProjectDelete} ) {

    const [projectSelection, setProjectSelection] = useState(false);
    const [projectConfig, setProjectConfig] = useState(false);
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
    
  return (
    <>
    <button onClick={()=>handleProjectSelection(true)}>Select Project</button>
    <button onClick={()=>handleProjectAdd()}>Create Project</button>
    <button onClick={()=>updateProjectToData()}>Save</button>
    <button>Deploy</button>
    <button onClick={()=>handleProjectConfig(true)}>Share</button>
    <button onClick={()=>handleProjectDelete(true)}>Delete</button>
    
    <ProjectList trigger={projectSelection} setTrigger={setProjectSelection} handleProjectDelete={handleProjectDelete}></ProjectList>
    <ShareProject trigger={projectConfig} setTrigger={setProjectConfig} selectedProject={selectedProject} setWarning={setWarning}></ShareProject>
    <SignOutWarning trigger={warning} setTrigger={setWarning}></SignOutWarning>
    <DeleteWarning trigger={deleteWarning} setTrigger={setDeleteWarning} selectedProject={selectedProject}></DeleteWarning>
    </>
  )
}
