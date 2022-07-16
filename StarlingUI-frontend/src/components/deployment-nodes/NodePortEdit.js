import React from 'react'

export default function NodePortEdit( {port, handlePortChange, handlePortDelete} ) {
    
    function handleChange(changes){
        handlePortChange(port.id, {...port, ...changes})
      }
      return (
        <>
        <input 
          type='text' 
          onChange={e=>handleChange({containerPort:e.target.value})}
          value={port.containerPort}
        >
        </input>
        <input 
          type='text' 
          onChange={e=>handleChange({protocol:e.target.value})}
          value={port.protocol}
        >
        </input>
        <button 
        onClick = {()=>handlePortDelete(port.id)}
        >&times;</button>
        </>
      )
}
