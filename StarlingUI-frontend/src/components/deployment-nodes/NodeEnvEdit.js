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
          className='popup-pair-grid popup-value input-small'
        >
        </input>
        <input 
          type='text' 
          onChange={e=>handleChange({value:e.target.value})}
          value={variable.value}
          className='popup-pair-grid popup-value input-small'
        >
        </input>
        <button 
        onClick = {()=>handleEnvDelete(variable.id)}
        className='popup-pair-grid-btn'
        >&times;</button>
        </>
      )
}
