import React, {useContext} from 'react'
import { useDrag } from "react-dnd";
import { ProjectContext } from '../App';

export default function Image(props) {

  const {images,projects} = useContext(ProjectContext);
    
    const [{isDragging},drag] = useDrag(()=>({
        type: "image",
        item: {id: props.id},
        collect: (monitor) =>({
            isDragging:!!monitor.isDragging(),
        })
    }))

  return (
    <div className='image-tag' ref={drag} style={{border: isDragging? "5px solid pink": "0px"}}>
        <p>{props.name}</p>
        <p>{props.dateModified}</p>
    </div>
  )
}
