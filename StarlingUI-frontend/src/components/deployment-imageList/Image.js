import React from 'react'
import { useDrag } from "react-dnd";
import hand from '../img/hand.gif';

export default function Image(props) {
    
    const [{isDragging},drag] = useDrag(()=>({
        type: "image",
        item: {id: props.id},
        collect: (monitor) =>({
            isDragging:!!monitor.isDragging(),
        })
    }))

  return (
    <div className='items-body-content grabbable' ref={drag} style={{border: isDragging? "2px solid hsl(200, 100%, 50%)": "0px"}}>
        {isDragging &&<img className="hand-icon" src={hand} alt="draggable" />}      
        <span className='image-name'>{props.name}</span>
        <span className='image-date'>{props.lastUpdated.split('T')[0]} {props.lastUpdated.split('T')[1].split('.')[0]}</span>
    </div>
  )
}
