import React, {useContext} from 'react'
import ImageEdit from './ImageEdit';
import { ProjectContext } from './App';
import { useDrop } from "react-dnd";

export default function MasterNode({masterNode, workingNodes, handleMasterNodeChange}) {

const {images} = useContext(ProjectContext);

const [{isOver},drop] = useDrop(()=>({
    accept: "image",
    drop: (item) => addImageToBoard(item.id),
    collect: (monitor) =>({
        isOver:!!monitor.isOver(),
    }),
}), [masterNode,workingNodes,images])

const addImageToBoard = (id) =>{
    console.log(id);
    handleImageAdd(id);
}

//pass in the object
function handleChange(changes){
//a brand new object
handleMasterNodeChange({...masterNode, ...changes})
}

function handleImageDelete(id){
    handleChange({images: masterNode.images.filter(i=> i.id !== id)});
}

function handleImageAdd(id){
    //no duplicate
    const resultIndex = masterNode.images.findIndex(element=>element.id===id);
    if(resultIndex===-1){
        console.log("no duplicate");
        const addedImage = images.find(element=>element.id===id);
        console.log(addedImage.name);
        handleChange({images: [...masterNode.images, addedImage]});
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
            value={masterNode.name || ''}
            onChange={e=>handleChange({name:e.target.value})}
            className='node-name-input'></input>
    <br></br>
    <p>Number of images: {masterNode.images.length}</p>
    <button onClick={()=>handleImageAllDelete()}>Clear All</button>
    <div className='node-image-tag-container' ref={drop}>
        {masterNode.images.map(image=>
            <ImageEdit key={image.id} image={image} handleImageDelete={handleImageDelete}></ImageEdit>
        )}
    </div>
    </div>
</div>
  )
}