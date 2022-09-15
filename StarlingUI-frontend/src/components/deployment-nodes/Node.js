import React, {useContext, useState} from 'react'
import Container from './Container';
import { ProjectContext } from '../App';
import { useDrop } from "react-dnd";
import NodeSetting from './NodeSetting.js';
import { v4 as uuidv4 } from 'uuid';
import search from '../../css/img/setting-svgrepo-com.svg';
import black from '../../css/img/Solid_black.png';
import computerIcon from '../../css/img/computer-svgrepo-com.svg';
import droneIcon from '../../css/img/aerial-drone-uav-svgrepo-com.svg';

import dronePic from '../../css/img/oie_151914634owYC2D.png';
import masterPic from '../../css/img/oie_15192229OeBZ3dl4.png'

export default function Node({node,nodes,handleNodeChange,handleNodeDelete,handleNodeDuplicate,pictureDisplay,setPictureDisplay}) {

    const {images, projects} = useContext(ProjectContext);

    const[setting, setSetting] = useState(false);

    const [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item) => addImageToBoard(item),
        collect: (monitor) =>({
            isOver:!!monitor.isOver(),
        }),
    }), [node,nodes,images,projects])
    
    const addImageToBoard = (item) =>{
        handleImageAdd(item.name);
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
    
    function handleImageAdd(name){
        //no duplicate
        const resultIndex = node.containers.findIndex(element=>element.name===name);
        if(resultIndex===-1){
            console.log("no duplicate");
            const addedImage = images.find(element=>element.name===name);
            console.log(addedImage.name);
            const newContainer = {
                id: addedImage.id,
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
        if(pictureDisplay!==false){
            if(kind==='master'){
                return(
                    <img className="circle-computer-icon" src={masterPic} alt=""/>
                )
            }
            else if(kind==='deployment'){
                return(
                    <img className="circle-computer-icon" src={dronePic} alt=""/>
                )
            }
        }
        else{
            return(
                <img className="black-icon" src={black} alt=""/>
            )
        }
    }

    function showIcon(kind){
        if(pictureDisplay===false){
            if(kind==='master'){
                return(
                    <img className='computer-title-icon' src={computerIcon} alt=""/>
                )
            }
            else if(kind==='deployment'){
                return(
                    <img className='drone-title-icon' src={droneIcon} alt=""/>
                )
            }

        }
    }

    function showHint(){
        if(node.containers?.length===0){
            return(
                <div className="drag-hint"><em>Drag left-side images to here</em></div>
            )
        }
    }
    
    //style={{background: isOver? "hsl(200, 100%, 40%)": "hsl(200, 100%, 20%)"}}
    
      return (
    <div>
        <div className='node'>
            <div className='node-title-bar' onClick={()=>setSetting(true)} title={node.name}>
                <div className={pictureDisplay===false? 'node-title wordwrap wordbreak with-icon' : 'node-title wordwrap wordbreak'}>{showIcon(node.kind)}{node.name}</div>
                <div className='node-kind' style={{ borderLeft: node.kind==='master'? "2px solid hsl(200, 100%, 70%)" : "2px solid #f2f2f2"}}><span>{showKindColor(node.kind)}</span></div>
            </div>
            <img className="setting-icon" src={search} alt="setting" title="setting" onClick={()=>setSetting(true)}/>
        
        <div className='drone-icon-container' onClick={()=>setSetting(true)}>{showPicture(node.kind)}</div>
        
        <div className={pictureDisplay===false? "node-image-tag-container no-picture": "node-image-tag-container"} ref={drop} style={{background: isOver? "#444": "#1a1a1a"}}>
            <div className='node-image-tag-number'>
                <p className='image-number'>Number of images: {node.containers.length}</p>
                <button className='btn btn-small btn-menu btn-pill' onClick={()=>handleImageAllDelete()}>Clear All</button>
            </div>
            {showHint()}
            {node.containers.map(image=>
                <Container key={image.id} image={image} handleImageDelete={handleImageDelete} handleContainerChange={handleContainerChange}></Container>
            )}
        </div>
        {showMoreButtons()}
        </div>
        <NodeSetting 
        trigger={setting} setTrigger={setSetting} 
        node={node} nodes={nodes} 
        handleNodeChange={handleNodeChange}></NodeSetting>
    </div>
      )
    }
