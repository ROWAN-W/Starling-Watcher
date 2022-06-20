import React, {useContext, useState} from 'react'
import Container from './Container';
import { ProjectContext } from '../App';
import { useDrop } from "react-dnd";
import NodeLabel from './NodeLabel';

export default function Node({node,nodes,handleNodeChange,handleNodeDelete,handleNodeDuplicate}) {
    
    const {images} = useContext(ProjectContext);

    const[setting, setSetting] = useState(false);

    const [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) =>({
            isOver:!!monitor.isOver(),
        }),
    }), [node,nodes,images])
    
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
                env: [],
                port: [],
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
                    <button onClick = {()=>handleNodeDuplicate(node)}>Duplicate</button>
                    <button onClick = {()=>handleNodeDelete(node.id)}>Delete</button>
                </div>
            )
        }
    }
    
    //need detail change
      return (
    <div>
        <div className='node'>
            <input 
                type='text' 
                name='name' 
                id='name'
                value={node.name || ''}
                onChange={e=>handleChange({name:e.target.value})}
                className='node-name-input'></input>
            <span>{node.kind.charAt(0).toUpperCase() + node.kind.slice(1)}</span>
            <button onClick={()=>setSetting(true)}>Setting</button>
            <NodeLabel trigger={setting} setTrigger={setSetting} node={node} handleNodeChange={handleNodeChange}></NodeLabel>
        <br></br>
        <p>Number of images: {node.containers.length}</p>
        <button onClick={()=>handleImageAllDelete()}>Clear All</button>
        <div className='node-image-tag-container' ref={drop}>
            {node.containers.map(image=>
                <Container key={image.id} image={image} handleImageDelete={handleImageDelete} handleContainerChange={handleContainerChange}></Container>
            )}
        </div>
        {showMoreButtons()}
        </div>
    </div>
      )
    }
