import React, {useContext, useState, useEffect, useRef} from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import Node from './Node';
import Filter from './Filter';
import SearchBox from './SearchBox';
import search from './search-svgrepo-com.svg';

export default function Project({currentUserID, selectedProject}) {

    const {handleProjectChange, signInPage} = useContext(ProjectContext);

    const [filterValue, setFilterValue] = useState('all');
    const [searchNode, setSearchNode] = useState('');

    const [showSearch, setShowSearch] = useState(false);
    const [clickAdd, setClickAdd] =useState(false);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setClickAdd(false);
    }

    useEffect(() => {
      if(clickAdd===true){
        scrollToBottom();
      }
    }, [clickAdd]);

    useEffect(() => {
      setFilterValue('all');
      setSearchNode('');
      setClickAdd(false);
      setShowSearch(false);
    }, [selectedProject]);


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
  const number = selectedProject.config.length+1;
  const newNode = {
      id: uuidv4(),
      name: 'new-deployment-'+number,
      kind: 'deployment',
      //can be empty
      label: {app: '',platform: ''},
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
        return <div className='items-head'><p className='instruct'>Please <em className='sign-in instruct' onClick={()=>signInPage()}>sign in</em> or load a project</p></div>
      }
      else if(selectedProject===undefined){
        return <div className='items-head'><p className='instruct'>Please select or create a project</p></div>
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
          </>
        )
      }
      }
    }

    function showProjectColumn(){
      if(selectedProject===undefined){
        return (
          <div className='project items'>
           {showInstruction()}
          </div>
        )
      }else{
        return (
          <div className='project items'>
            <img className="search-icon" src={search} alt="search" title="search/filter" onClick={()=>setShowSearch(prev=>!prev)}/>
            <div className='node-search-filter'>
            {showSearch &&<><SearchBox setSearchNode={setSearchNode} searchNode={searchNode}></SearchBox>
              <Filter filterValue={filterValue} setFilterValue={setFilterValue}></Filter></>}
            </div>
          <div className='project-container-single'>
           {showProjectDetail()}
          </div>
          {selectedProject===undefined? null: 
            <div className='btn-add-node'>
              <button className='btn btn-menu btn-pill' onClick = {()=>{handleNodeAdd();setSearchNode('');setFilterValue('all');setClickAdd(true);}}>Add Design</button><div ref={messagesEndRef} /></div>}
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