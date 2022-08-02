import React, { useEffect } from 'react'

export default function DeployWarning(props) {

    useEffect(()=>{
      },[props.trigger]);
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
                <button className='close' onClick={()=>props.setTrigger(false)}>&times;</button>
                <h2 className='title-error'>Can't Deploy</h2>
                <div className='content'>{props.message}</div>
                <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false);}}>OK</button>
                </div>
            </div>
        </div>
      ): ""
}
