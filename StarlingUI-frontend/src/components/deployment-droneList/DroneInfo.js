import React from 'react'

export default function DroneInfo(props) {
  
    return (props.trigger) ?(

        <td colSpan="3">
        {props.drone.info}
        </td>
      ): ""
}
