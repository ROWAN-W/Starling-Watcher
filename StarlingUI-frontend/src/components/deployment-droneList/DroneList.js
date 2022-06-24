import React, { useState, useEffect } from 'react'
import Drone from './Drone'
import useFetch from '../useFetch';

export default function DroneList(props) {

    //const { error: droneError, isPending: dronePending , data:drones } = useFetch('http://localhost:8002/sampleDrone',[props.updateClick])

    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();


    const [dronePending, setIsPending] = useState(true);
    const [droneError, setError] = useState(null);
    //const [waiting, setWaiting] = useState(false);
    

    useEffect(() => {
        const url = "http://localhost:8002/sampleDrone";
          
          fetch(url)
          .then(res => {
            if (!res.ok) { // error coming back from server
                setIsPending(false);
                props.setWaiting(false);
                props.setData();
                setError('Error Details: '+res.status);
            } 
            return res.json();
          })
          .then(data => {
            setIsPending(false);
            props.setWaiting(false);
            props.setData(data);
            setError(null);
            console.log("fetch "+url);
          })
          .catch(err => {
            // auto catches network / connection error
            setIsPending(false);
            props.setWaiting(false);
            setError(err.message);
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

    function message(){
       
        if(props.waiting===true){
            props.setUpdateMes("Please wait...");
            return <div>Please wait...</div>
        }
        if(droneError){
            props.setUpdateMes("No available drones...");
            return <div>{ droneError }</div>
        }
        if(dronePending){
            props.setUpdateMes("Loading...");
            return <div>Loading...</div>
        }
        if(!props.data && !droneError){
            props.setUpdateMes("Please wait...");
            return <div>Please wait...</div>
        }
        if(props.data){
            props.setUpdateMes("");
        }
    }
      
    return (props.trigger) ?(
    <>
    <div className='drone-container'>
    <div><span className='drone-container-title'>Available Drones</span><button onClick={()=>{props.handleUpdateTime();}}>{droneError? "Try Again" : "Sync"}</button><button onClick={()=>props.setTrigger(false)}>Hide</button></div>
    <div className='drone-update-time'>last sync: {props.updateTime}</div>
    {message()}
    { (props.data ) &&
    <table>
        <thead>
        <tr>
            <th onClick={()=>{sorting("name");setOrderCol("name")}}>Name {showIcon("name")}</th>
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

/**
 *         //setUpdateMes
        //{ (droneError ) && <div>{ droneError }</div> }
        //{ (dronePending ) && <div>Loading...</div> }
        //{ (!props.data && !droneError) && <div>Please wait...</div> }
 */