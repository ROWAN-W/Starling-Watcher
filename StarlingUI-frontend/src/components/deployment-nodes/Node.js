import React, {useContext, useState} from 'react'
import Container from './Container';
import { ProjectContext } from '../App';
import { useDrop } from "react-dnd";
import NodeSetting from './NodeSetting.js';
import { v4 as uuidv4 } from 'uuid';
import search from './setting-svgrepo-com.svg';
import drone from './drone-svgrepo-com.png';
import master from './computer-g4ab8b29b5_640.png';
//computer-g95db6e1f0_640
//computer-g4ab8b29b5_640
//monitor-g2bad68c9c_640
//lcd-gbe5a637c8_640
export default function Node({node,nodes,handleNodeChange,handleNodeDelete,handleNodeDuplicate}) {
    
    const {images, projects} = useContext(ProjectContext);

    const[setting, setSetting] = useState(false);

    const [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) =>({
            isOver:!!monitor.isOver(),
        }),
    }), [node,nodes,images,projects])
    
    const addImageToBoard = (id) =>{
        console.log(id);
        handleImageAdd(id);
    }
    
    function handleChange(changes){
        handleNodeChange(node.id, {...node, ...changes})
    }

    function handleContainerChange(id, container){
        const newContainers = [...node.containers];
        const index = newContainers.findIndex(i=>i.id===id);
        newContainers[index] = container;
        handleChange({containers:newContainers});
    }
    
    function handleImageDelete(id){
        handleChange({containers: node.containers.filter(element=> element.id !== id)});
    }
    
    function handleImageAdd(id){
        //no duplicate
        const resultIndex = node.containers.findIndex(element=>element.id===id);
        if(resultIndex===-1){
            console.log("no duplicate");
            const addedImage = images.find(element=>element.id===id);
            console.log(addedImage.name);
            const newContainer = {
                id: id,
                name: addedImage.name,
                command: '',
	         	args: '',
                env: [
                    {
                        id: uuidv4(),
                        name: "",
                        value: ""
                    }
                ],
                port: [
                    {
                        id: uuidv4(),
                        containerPort: "",
                        protocol: ""
                    }
                ],
            }
            handleChange({containers: [...node.containers, newContainer]});
        }
    }
    
    function handleImageAllDelete(){
        handleChange({containers: []});   
    }

    function showMoreButtons(){
        if(node.kind!=='master'){
            return(
                <div className='node-btn'>
                    <button className='btn btn-menu' onClick = {()=>handleNodeDuplicate(node)}>Copy</button>
                    <button className='btn btn-menu' onClick = {()=>handleNodeDelete(node.id)}>Delete</button>
                </div>
            )
        }else{
            return(
                <div className='node-btn'>
                    <button className='btn btn-menu' onClick = {()=>handleNodeDelete(node.id)}>Delete</button>
                </div>
            )
        }
    }

    function showKindColor(kind){
        //node.kind.charAt(0).toUpperCase() + node.kind.slice(1)
        if(kind==='master'){
            return(
                <span style={{color: "hsl(200, 100%,70%)"}}>Master</span>
            )
        }
        else{
            return(
                <span style={{color: "#f2f2f2"}}>Deployment</span>
            )
        }
    }

    function showPicture(kind){
        if(kind==='master'){
            return(
                <img className="computer-icon" src={master} alt="master"/>
            )
        }
        else{
            return(
                <img className="drone-icon" src={drone} alt="drone deployment"/>
            )
        }

    }
    
    
    
      return (
    <div>
        <div className='node'>
            <div className='node-title-bar' onClick={()=>setSetting(true)}>
                <div className='node-title'>{node.name}</div>
                <div className='node-kind' style={{ "border-left": node.kind==='master'? "2px solid hsl(200, 100%, 70%)" : "2px solid #f2f2f2"}}><span>{showKindColor(node.kind)}</span></div>
            </div>
            <img className="setting-icon" src={search} alt="setting" title="setting" onClick={()=>setSetting(true)}/>
        
        <div className='drone-icon-container' onClick={()=>setSetting(true)}>{showPicture(node.kind)}</div>
        
        <div className='node-image-tag-container' ref={drop} style={{background: isOver? "hsl(200, 100%, 40%)": "hsl(200, 100%, 20%)"}}>
            <div className='node-image-tag-number'>
                <p className='image-number'>Number of images: {node.containers.length}</p>
                <button className='btn btn-small btn-menu btn-pill' onClick={()=>handleImageAllDelete()}>Clear All</button>
            </div>
            {node.containers.map(image=>
                <Container key={image.id} image={image} handleImageDelete={handleImageDelete} handleContainerChange={handleContainerChange}></Container>
            )}
        </div>
        {showMoreButtons()}
        </div>
        <NodeSetting trigger={setting} setTrigger={setSetting} node={node} nodes={nodes} handleNodeChange={handleNodeChange}></NodeSetting>
    </div>
      )
    }
