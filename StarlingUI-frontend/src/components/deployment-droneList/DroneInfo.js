import React from 'react'

export default function DroneInfo(props) {

  //const showRoles = props.drone.roles.map(role => <span key={role}>{role},&nbsp;</span>);
  const showLabels = Object.keys(props.drone.labels).map((key, i) => (<div className='drone-item-object' key={i}><span>{key}</span><span>{props.drone.labels[key]}</span></div>));
  const showAnnotations = Object.keys(props.drone.annotations).map((key, i) => (<div className='drone-item-object' key={i}><span>{key}</span><span>{props.drone.annotations[key]}</span></div>));

    return (props.trigger) ?(

        <td title="collapse" className="drone-more-info" colSpan="4" width="200px" onClick={()=>props.setShowInfo(prev=>!prev)}>
        <div className='drone-item'><span className='drone-item-title'>Architecture:</span> {props.drone.architecture}</div>
        <div className='drone-item'><span className='drone-item-title'>Labels:</span> {showLabels}</div>
        <div className='drone-item'><span className='drone-item-title'>Annotations:</span> {showAnnotations}</div>
        <div className='drone-item'><span className='drone-item-title'>Create Time:</span> {props.drone.creationTime.split('+')[0].replace('T', ' ').replace('Z', '')}</div>
        </td>
      ): ""
}
