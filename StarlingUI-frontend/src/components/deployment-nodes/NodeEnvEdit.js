import React from 'react'

export default function NodeEnvEdit( {variable, handleEnvChange, handleEnvDelete} ) {
    
    function handleChange(changes){
        handleEnvChange(variable.id, {...variable, ...changes})
      }
      return (
        <>
        <input 
          type='text' 
          onChange={e=>handleChange({name:e.target.value})}
          value={variable.name}
        >
        </input>
        <input 
          type='text' 
          onChange={e=>handleChange({value:e.target.value})}
          value={variable.value}
        >
        </input>
        <button 
        onClick = {()=>handleEnvDelete(variable.id)}
        >&times;</button>
        </>
      )
}
