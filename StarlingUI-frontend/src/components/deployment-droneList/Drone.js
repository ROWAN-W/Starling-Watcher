import React, { useState } from 'react'
import DroneInfo from './DroneInfo'

export default function Drone(props) {
    
    const [showInfo,setShowInfo] = useState(false);

    function showButton(){
        if(showInfo===false){
            return <span onClick={()=>setShowInfo(true)}>▼</span>
        }else{
            return <span onClick={()=>setShowInfo(false)}>▲</span>
        }
    }

    return (
        <>
        <tbody>
        <tr>
            <td>{props.name}</td>
            <td>{props.hostname}</td>
            <td>{props.ip}</td>
            <td>{props.architecture}</td>
            <td>{showButton()}</td>
        </tr>
        <tr>
        <DroneInfo trigger={showInfo} drone={props}></DroneInfo>
        </tr>
        </tbody>
        </>
      )
}
