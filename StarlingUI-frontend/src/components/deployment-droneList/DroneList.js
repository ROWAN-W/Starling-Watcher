import React, { useState, useEffect } from 'react'
import Drone from './Drone'

export default function DroneList(props) {

    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();    

    useEffect(() => {
        const url = "http://localhost:8002/sampleDrone";
          
          fetch(url)
          .then(res => {
            if (!res.ok) { // error coming back from server
                throw Error('Error Details: '+res.status);
            } 
            return res.json();
          })
          .then(data => {
            props.setWaiting(false);
            //only for testing
            props.setData(data);
            props.setError(null);
            console.log("fetch "+url);
          })
          .catch(err => {
            // auto catches network / connection error
            props.setData();
            props.setWaiting(false);
            props.setError(err.message);
          })
        
      },[props.updateClick])

    function sorting(col){
        if(order==="ASC"){
            console.log("ASC");
            console.log([...props.data]);
            const sorted = [...props.data].sort((a,b)=>
            a[col].toLowerCase() > b[col].toLowerCase() ? 1: -1);
            props.setData(sorted);
            setOrder("DSC");
        }else if(order==="DSC"){
            console.log("DSC");
            console.log([...props.data]);
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
    <div><span className='drone-container-title'>Available Devices</span><button onClick={()=>{props.handleUpdateTime();}}>{props.error? "Sync Again" : "Sync"}</button><button onClick={()=>props.setTrigger(false)}>Hide</button></div>
    <div className='drone-update-time'>last sync: {props.updateTime}</div>
    {props.waiting && <div>Please wait...</div>}
    {props.error && <div>{ props.error }</div>}
    { (props.data ) &&
    <table>
        <thead>
        <tr>
            <th onClick={()=>{sorting("nodeName");setOrderCol("nodeName")}}>Name {showIcon("nodeName")}</th>
            <th onClick={()=>{sorting("hostname");setOrderCol("hostname")}}>Hostname {showIcon("hostname")}</th>
            <th onClick={()=>{sorting("ip");setOrderCol("ip")}}>IP Address {showIcon("ip")}</th>
            <th onClick={()=>{sorting("architecture");setOrderCol("architecture")}}>Architecture {showIcon("architecture")}</th>
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