import React, { useEffect } from 'react'

export default function DeployWarning(props) {

    useEffect(()=>{
      },[props.trigger]);
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
                <p>{props.message}</p>
                <button onClick={()=>{props.setTrigger(false);}}>OK</button>
            </div>
        </div>
      ): ""
}
