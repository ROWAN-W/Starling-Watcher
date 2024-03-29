import React, {useContext, useState, useEffect, useRef} from 'react'
import { ProjectContext } from '../App';
import { v4 as uuidv4 } from 'uuid';
import Node from './Node';
import Filter from './Filter';
import SearchBox from './SearchBox';


export default function Project({selectedProject}) {

    const {handleProjectChange, signInPage, currentUserID, userData} = useContext(ProjectContext);

    const [filterValue, setFilterValue] = useState('all');
    const [searchNode, setSearchNode] = useState('');

    const [clickAdd, setClickAdd] =useState(false);

    const [pictureDisplay, setPictureDisplay] = useState(false);

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
      name: 'device-'+number,
      kind: 'deployment',
      //can be empty
      label: {app: selectedProject.name ,platform: ''},
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
  const newMapping = {
    nodeID: newNode.id,
    mappedDrones: []
  }
  handleChange({config: [...selectedProject.config, newNode],mapping: [...selectedProject.mapping, newMapping]});
  //handleMappingAdd(newNode.id);
}

const openInNewTab = url => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
    
    function showInstruction(){
      if(currentUserID===''){
        return <div className='items-head'><h2 className='instruct'>Welcome!<br/>Please <em className='sign-in instruct' onClick={()=>signInPage()}>sign in</em>.</h2></div>
      }
      else{
        if(selectedProject===undefined){
          return <div className='items-head'><h2 className='instruct'>
            Hello {userData?.find(user=>user.id===currentUserID).name}!<br/>
            Please "create" or "select" a project to configure a template.<br/>
            More instructions on <a href="/#" style={{ color:'yellow' }} onClick={() => openInNewTab('https://docs.google.com/document/d/1NMfBBrReewYa-scV08dLgkERnHrKWU_1o3UF1Qobino/edit?usp=sharing')}>Quick Start Guide</a>.
            </h2>
            </div>
        }
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
                  pictureDisplay={pictureDisplay}
                  setPictureDisplay={setPictureDisplay}
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
                    pictureDisplay={pictureDisplay}
                    setPictureDisplay={setPictureDisplay}
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
              pictureDisplay={pictureDisplay}
              setPictureDisplay={setPictureDisplay}
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
                pictureDisplay={pictureDisplay}
                setPictureDisplay={setPictureDisplay}
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
            <div className='total-node-number'>Configuration ({selectedProject.config?.length})<span className='show-picture' onClick={()=>setPictureDisplay(prev=>!prev)}>{pictureDisplay===false? "Show Picture":"Hide Picture"}</span></div>
            <div className='node-search-filter'>
              <SearchBox setSearchNode={setSearchNode} searchNode={searchNode}></SearchBox>
              <Filter filterValue={filterValue} setFilterValue={setFilterValue}></Filter>
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