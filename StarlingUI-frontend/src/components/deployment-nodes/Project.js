import React, {useContext} from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import Node from './Node';

export default function Project({currentUserID, selectedProject, droneListTrigger}) {

    const {projects, handleProjectChange} = useContext(ProjectContext);

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

function handleMappingAdd(nodeID){
  const newMapping = {
      nodeID: nodeID,
      mappedDrones: []
  }
  handleChange({mapping: [...selectedProject.mapping, newMapping]});
}

function handleMappingDelete(nodeID){
  handleChange({mapping: selectedProject.mapping.filter(i=> i.nodeID !== nodeID)});
}

function handleNodeAdd(){
  const newNode = {
      id: uuidv4(),
      name: 'new node',
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
      name: 'new-'+node.name,
      kind: 'deployment',
      label: node.label,
      containers: [...node.containers],
  }

  handleChange({config: [...selectedProject.config, newNode]});
}
    
    function showInstruction(){
      if(currentUserID===undefined){
        return <div>Please sign in</div>
      }
      else if(selectedProject===undefined){
        return <div>Please select or create a project</div>
      }
    }

    function showProjectDetail(){
      if(currentUserID!==undefined && selectedProject!==undefined){
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

    //show master node and working nodes only
return (
  <>
    {showProjectColumn()}
  </>
  )
}