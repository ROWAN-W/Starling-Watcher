import React from 'react'

export default function DroneInfo(props) {

  const showRoles = props.drone.roles.map(role => <span key={role}>{role},&nbsp;</span>);
  const showLabels = Object.keys(props.drone.labels).map((key, i) => (<div className='drone-item-object' key={i}><span>{key}</span><span>{props.drone.labels[key]}</span></div>));
  const showAnnotations = Object.keys(props.drone.annotations).map((key, i) => (<div className='drone-item-object' key={i}><span>{key}</span><span>{props.drone.annotations[key]}</span></div>));

    return (props.trigger) ?(

        <td colSpan="4">
        <div className='drone-item'><strong>Roles:</strong> {showRoles}</div>
        <div className='drone-item'><strong>Labels:</strong> {showLabels}</div>
        <div className='drone-item'><strong>Annotations:</strong> {showAnnotations}</div>
        <div className='drone-item'><strong>Creation Time:</strong> {props.drone.creationTime}</div>
        </td>
      ): ""
}
