import React, { useState } from 'react'
import DroneInfo from './DroneInfo'

export default function Drone(props) {
    
    const [showInfo,setShowInfo] = useState(false);

    return (
        <>
        <tbody>
        <tr onClick={()=>setShowInfo(prev=>!prev)} style={{background: showInfo? "hsl(200, 100%, 15%)": "hsl(200, 100%, 10%)"}}>
            <td>{props.nodeName}</td>
            <td>{props.hostname}</td>
            <td>{props.ip}</td>
            <td>{props.role}</td>
        </tr>
        <tr>
        <DroneInfo trigger={showInfo} drone={props}></DroneInfo>
        </tr>
        </tbody>
        </>
      )
}
