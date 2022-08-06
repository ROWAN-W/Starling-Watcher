import React, { useState } from 'react'
import DroneInfo from './DroneInfo'

export default function Drone(props) {
    
    const [showInfo,setShowInfo] = useState(false);
//style={{background: showInfo? "hsl(200, 100%, 15%)": "hsl(200, 100%, 10%)"}}
    return (
        <>
        <tbody>
        <tr title="more info" onClick={()=>setShowInfo(prev=>!prev)} style={{background: showInfo? "#333": "rgba(12, 10, 11, 0.8)"}}>
            <td>{props.nodeName}</td>
            <td>{props.hostname}</td>
            <td>{props.ip}</td>
            <td>{props.role}</td>
        </tr>
        <tr>
        <DroneInfo trigger={showInfo} drone={props} setShowInfo={setShowInfo}></DroneInfo>
        </tr>
        </tbody>
        </>
      )
}
