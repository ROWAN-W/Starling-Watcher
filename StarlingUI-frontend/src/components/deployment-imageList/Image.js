import React from 'react'
import { useDrag } from "react-dnd";

export default function Image(props) {
    
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
        <p>{props.lastUpdated}</p>
    </div>
  )
}
