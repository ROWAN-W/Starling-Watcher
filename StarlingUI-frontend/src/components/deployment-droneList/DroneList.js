import React, { useState, useEffect } from 'react'
import Drone from './Drone'
import useFetch from '../useFetch';

export default function DroneList(props) {

    const [updateClick, setUpdateClick] = useState(false);
    const { error: droneError, isPending: dronePending , data:drones } = useFetch('http://localhost:8002/sampleDrone',[updateClick])

    const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();
    

    useEffect(()=>{
        console.log("render drone list");
        props.setData(drones);
      },[drones]);

    function handleUpdateTime(){
        setUpdateClick(prev=>!prev);
        setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
    }

    function sorting(col){
        if(order==="ASC"){
            console.log("ASC");
            const sorted = [...props.data].sort((a,b)=>
            a[col].toLowerCase() > b[col].toLowerCase() ? 1: -1);
            props.setData(sorted);
            setOrder("DSC");
        }else if(order==="DSC"){
            console.log("DSC");
            const sorted = [...props.data].sort((a,b)=>
            a[col].toLowerCase() < b[col].toLowerCase() ? 1: -1);
            props.setData(sorted);
            setOrder("ASC");
        }
    }

    function showIcon(col){
        if(col===orderCol){
            return <span className='drone-sort-icon'>↑↓</span>
        }
    }
      
    return (props.trigger) ?(
    <>
    <div className='drone-container'>
    <div><span className='drone-container-title'>Available Drones</span><button onClick={()=>{handleUpdateTime();}}>Sync</button><button onClick={()=>props.setTrigger(false)}>Hide</button></div>
    <div className='drone-update-time'>last sync: {updateTime}</div>
    { (droneError ) && <div className="message">{ droneError }</div> }
    { (dronePending ) && <div className="message">Loading...</div> }
    { (props.data ) &&
    <table>
        <thead>
        <tr>
            <th onClick={()=>{sorting("name");setOrderCol("name")}}>Name {showIcon("name")}</th>
            <th onClick={()=>{sorting("type");setOrderCol("type")}}>Type {showIcon("type")}</th>
            <th onClick={()=>{sorting("mac");setOrderCol("mac")}}>MAC {showIcon("mac")}</th>
        </tr>
        </thead>
        
        {props.data?.map(drone=>{
            return <Drone key={drone.id} {...drone}></Drone> 
        })}
        
    </table>}
    </div>
    </>
  ): ""
}
