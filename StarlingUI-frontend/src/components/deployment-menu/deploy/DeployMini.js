import React from 'react'

export default function DeployMini(props) {

    return (props.trigger) ? (
        <div className="minimize">
            <p className="minimize-title">Deploy Configuration to Drones
            <button onClick={()=>{props.setTrigger(false);}}>Max</button>
            <button onClick={()=>{props.setTrigger(null);}}>&times;</button>
            </p>
        </div>
      ): ""
}
