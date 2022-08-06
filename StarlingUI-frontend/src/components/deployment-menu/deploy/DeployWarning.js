import React, { useEffect } from 'react'

export default function DeployWarning(props) {

  useEffect(()=>{
    //key friendly
    window.addEventListener('keydown', keyOperation);
        
    return () => { 
      window.removeEventListener('keydown', keyOperation);
    };
  },[]);

  function keyOperation(e){
    if(e.key==='Escape'||e.code==='Escape'){
      props.setTrigger(false)
    }
  }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
                <button className='close' onClick={()=>props.setTrigger(false)}>&times;</button>
                <h2 className='title-error'>Can't Deploy</h2>
                <div className='content'>{props.message}</div>
                <div className='key-hint'>(Press ESC to leave)</div>
                <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false);}}>OK</button>
                </div>
            </div>
        </div>
      ): ""
}
