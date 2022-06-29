import React, {useContext, useState, useEffect, useRef} from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import Node from './Node';
import Filter from './Filter';
import SearchBox from './SearchBox';

export default function Project({currentUserID, selectedProject, droneListTrigger}) {

    const {handleProjectChange, signInPage} = useContext(ProjectContext);

    const [filterValue, setFilterValue] = useState('all');
    const [searchNode, setSearchNode] = useState('');

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
      scrollToBottom()
    }, [selectedProject?.config.length]);


  function handleChange(changes){
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
        if(filterValue!=='all'){
          const filterResult = selectedProject.config.filter(node=>node.kind===filterValue);
          return (
            <>
              {searchNode===''? 
              filterResult.map(node=>
                <Node
                  key={node.id}
                  nodes={selectedProject.config}
                  node={node}
                  handleNodeChange={handleNodeChange}
                  handleNodeDelete={handleNodeDelete}
                  handleNodeDuplicate={handleNodeDuplicate}
                >
                </Node>):
                filterResult.filter(node=>node.name.toLowerCase().includes(searchNode.toLowerCase())).map(node=>
                  <Node
                    key={node.id}
                    nodes={selectedProject.config}
                    node={node}
                    handleNodeChange={handleNodeChange}
                    handleNodeDelete={handleNodeDelete}
                    handleNodeDuplicate={handleNodeDuplicate}
                  >
                  </Node>
                )}
              
                {selectedProject===undefined? null: 
                <div className='btn-add-node'><button onClick = {()=>{
                  setFilterValue('all');
                  setSearchNode('');
                  handleNodeAdd();
                  }}>Add Node</button></div>}
            </>
          )
        }
        else{
          return (
          <>
          {searchNode===''?
          selectedProject.config.map(node=>
            <Node
              key={node.id}
              nodes={selectedProject.config}
              node={node}
              handleNodeChange={handleNodeChange}
              handleNodeDelete={handleNodeDelete}
              handleNodeDuplicate={handleNodeDuplicate}
            >
            </Node>): 
            selectedProject.config.filter(node=>node.name.toLowerCase().includes(searchNode.toLowerCase())).map(node=>
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
            <div className='btn-add-node'><button onClick = {()=>{handleNodeAdd();setSearchNode('');}}>Add Node</button><div ref={messagesEndRef} /></div>}
          </>
        )
      }
      }
    }

    function showProjectColumn(){
      if(selectedProject===undefined){
        return (
          <div className='project'>
           {showInstruction()}
          </div>
        )
      }else{
        return (
          <div className='project'>
            <div className='image__search-container'>
              <Filter filterValue={filterValue} setFilterValue={setFilterValue}></Filter>
              <SearchBox setSearchNode={setSearchNode} searchNode={searchNode}></SearchBox>
            </div>
          <div className={droneListTrigger? 'project-container-single': 'project-container'}>
           {showProjectDetail()}
          </div>
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