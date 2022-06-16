import React, { useState } from 'react'
import DroneInfo from './DroneInfo'

export default function Drone(props) {
    
    const [showInfo,setShowInfo] = useState(false);

    function showButton(){
        if(showInfo===false){
            return <button onClick={()=>setShowInfo(true)}>▼</button>
        }else{
            return <button onClick={()=>setShowInfo(false)}>▲</button>
        }
    }

    return (
        <>
        <tbody>
        <tr>
            <td>{props.name}</td>
            <td>{props.type}</td>
            <td>{props.mac}</td>
            <td>{showButton()}</td>
        </tr>
        <tr>
        <DroneInfo trigger={showInfo} drone={props}></DroneInfo>
        </tr>
        </tbody>
        </>
      )
}
