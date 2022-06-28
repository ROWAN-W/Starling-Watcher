import React, {useContext} from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import Node from './Node';

export default function Project({currentUserID, selectedProject, droneListTrigger}) {

    const {projects, handleProjectChange, signInPage} = useContext(ProjectContext);

  //pass in the object
  function handleChange(changes){
  //a brand new object
  handleProjectChange(selectedProject.id, {...selectedProject,...changes});
  }

  function handleNodeChange(id, node){
    const newNodes = [...selectedProject.config];
    const index = newNodes.findIndex(i=>i.id===id);
    newNodes[index] = node;
    handleChange({config:newNodes});
}

function handleNodeAdd(){
  const number = selectedProject.config.length;
  const newNode = {
      id: uuidv4(),
      name: 'new node['+number+']',
      kind: 'deployment',
      label: {app: 'starling',platform: 'pixhawk'},
      containers: []
  }
  const newMapping = {
    nodeID: newNode.id,
    mappedDrones: []
  }
  handleChange({config: [...selectedProject.config, newNode],mapping: [...selectedProject.mapping, newMapping]});
  //handleMappingAdd(newNode.id);
}

function handleNodeDelete(id){
  console.log("delete");
  handleChange({config: selectedProject.config.filter(i=> i.id !== id),mapping: selectedProject.mapping.filter(i=> i.nodeID !== id)});
  //handleMappingDelete(id);
}

function handleNodeDuplicate(node){
  console.log("duplicate")
  const newNode = {
      id: uuidv4(),
      name: node.name+'-copy',
      kind: 'deployment',
      label: node.label,
      containers: [...node.containers],
  }

  handleChange({config: [...selectedProject.config, newNode]});
}
    
    function showInstruction(){
      //test
      if(currentUserID===''){
        return <div>Please <em onClick={()=>signInPage()}>sign in</em></div>
      }
      else if(selectedProject===undefined){
        return <div>Please select or create a project</div>
      }
    }

    function showProjectDetail(){
      if(currentUserID!=='' && selectedProject!==undefined){
        console.log(selectedProject);
        console.log(projects);
        return (
        <>
          {selectedProject.config.map(node=>
            <Node
              key={node.id}
              nodes={selectedProject.config}
              node={node}
              handleNodeChange={handleNodeChange}
              handleNodeDelete={handleNodeDelete}
              handleNodeDuplicate={handleNodeDuplicate}
            >
            </Node>)}
            {selectedProject===undefined? null: 
            <div className='btn-add-node'><button onClick = {()=>handleNodeAdd()}>Add Node</button></div>}
        </>
        )
      }

    }

    function showProjectColumn(){
      if(droneListTrigger){
        return (
          <div className='project-container-single'>
           {showInstruction()}
           {showProjectDetail()}
          </div>
        )
      }else{
        return (
          <div className='project-container'>
           {showInstruction()}
           {showProjectDetail()}
          </div>
        )
      }
    }

return (
  <>
    {showProjectColumn()}
  </>
  )
}