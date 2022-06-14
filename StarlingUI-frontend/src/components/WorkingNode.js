import React, {useContext} from 'react'
import ImageEdit from './ImageEdit';
import { ProjectContext } from './App';
import { useDrop } from "react-dnd";

export default function WorkingNode({masterNode,workingNode,handleWorkingNodeChange,handleWorkingNodeDelete,handleWorkingNodeDuplicate}) {
    
    const {images} = useContext(ProjectContext);

    const [{isOver},drop] = useDrop(()=>({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) =>({
            isOver:!!monitor.isOver(),
        }),
    }), [masterNode,workingNode,images])
    
    const addImageToBoard = (id) =>{
        console.log(id);
        handleImageAdd(id);
    }
    
    function handleChange(changes){
        handleWorkingNodeChange(workingNode.id, {...workingNode, ...changes})
    }
    
    function handleImageDelete(id){
        handleChange({images: workingNode.images.filter(i=> i.id !== id)});
    }
    
    function handleImageAdd(id){
        //no duplicate
        const resultIndex = workingNode.images.findIndex(element=>element.id===id);
        if(resultIndex===-1){
            console.log("no duplicate");
            const addedImage = images.find(element=>element.id===id);
            console.log(addedImage.name);
            handleChange({images: [...workingNode.images, addedImage]});
        }
    }
    
    function handleImageAllDelete(){
        handleChange({images: []});   
    }
    
    //need detail change
      return (
    <div>
        <div className='node'>
            <input 
                type='text' 
                name='name' 
                id='name'
                value={workingNode.name || ''}
                onChange={e=>handleChange({name:e.target.value})}
                className='node-name-input'></input>
        <br></br>
        <p>Number of images: {workingNode.images.length}</p>
        <button onClick={()=>handleImageAllDelete()}>Clear All</button>
        <div className='node-image-tag-container' ref={drop}>
            {workingNode.images.map(image=>
                <ImageEdit key={image.id} image={image} handleImageDelete={handleImageDelete}></ImageEdit>
            )}
        </div>
        <div className='node-btn'>
            <button onClick = {()=>handleWorkingNodeDuplicate(workingNode)}>Duplicate</button>
            <button onClick = {()=>handleWorkingNodeDelete(workingNode.id)}>Delete</button>
        </div>
        </div>
    </div>
      )
    }
