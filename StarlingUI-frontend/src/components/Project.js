import React, {useContext} from 'react'
import { ProjectContext } from './App';
import MasterNode from './MasterNode';
import { v4 as uuidv4 } from 'uuid';
import WorkingNode from './WorkingNode';

export default function Project({currentUser, selectedProject, droneListTrigger}) {

    const {projects, handleProjectChange} = useContext(ProjectContext);

  //pass in the object
  function handleChange(changes){
  //a brand new object
  handleProjectChange(selectedProject.id, {...selectedProject,...changes});
  }
  
  function handleMasterNodeChange(masterNode){
      handleChange({masterNode:masterNode});
  }

  function handleWorkingNodeChange(id, workingNode){
    const newWorkingNodes = [...selectedProject.workingNodes];
    const index = newWorkingNodes.findIndex(i=>i.id===id);
    newWorkingNodes[index] = workingNode;
    handleChange({workingNodes:newWorkingNodes});
}

function handleWorkingNodeAdd(){
  const newWorkingNode = {
      id: uuidv4(),
      name: 'new node',
      images: []
  }

  handleChange({workingNodes: [...selectedProject.workingNodes, newWorkingNode]});
}

function handleWorkingNodeDelete(id){
  console.log("delete");
  handleChange({workingNodes: selectedProject.workingNodes.filter(i=> i.id !== id)});
}

function handleWorkingNodeDuplicate(workingNode){
  console.log("duplicate")
  const newWorkingNode = {
      id: uuidv4(),
      name: 'new-'+workingNode.name,
      images: [...workingNode.images],
      deployedDrones:[]
  }

  handleChange({workingNodes: [...selectedProject.workingNodes, newWorkingNode]});
}
    
    function showInstruction(){
      if(currentUser===undefined){
        return <div>Please sign in</div>
      }
      else if(selectedProject===undefined){
        return <div>Please select or create a project</div>
      }
    }

    function showProjectDetail(){
      if(selectedProject!==undefined){
        console.log(selectedProject);
        console.log(projects);
        return (
        <>
          <MasterNode masterNode={selectedProject.masterNode} workingNodes={selectedProject.workingNodes} handleMasterNodeChange={handleMasterNodeChange}></MasterNode>
          {selectedProject.workingNodes.map(workingNode=>
            <WorkingNode
              key={workingNode.id}
              masterNode={selectedProject.masterNode}
              workingNodes={selectedProject.workingNodes}
              workingNode={workingNode}
              handleWorkingNodeChange={handleWorkingNodeChange}
              handleWorkingNodeAdd={handleWorkingNodeAdd}
              handleWorkingNodeDelete={handleWorkingNodeDelete}
              handleWorkingNodeDuplicate={handleWorkingNodeDuplicate}
            >
            </WorkingNode>)}
            {selectedProject===undefined? null: 
            <div className='btn-add-node'><button onClick = {()=>handleWorkingNodeAdd()}>Add Node</button></div>}
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
