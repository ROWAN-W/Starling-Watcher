import React from 'react'

export default function DeployMini(props) {

    return (props.trigger) ? (
        <div className="minimize">
            <div className="minimize-title" onClick={()=>{props.setTrigger(false);}}>Deploy Configuration</div>
            <div>
            <button className='popup-close-button' onClick={()=>{props.setTrigger(false);}}>☐</button>
            <button className="popup-close-button" onClick={()=>{props.setTrigger(null);}}>&times;</button>
            </div>
        </div>
      ): ""
}
