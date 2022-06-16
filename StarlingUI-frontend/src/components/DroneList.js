import React, { useState } from 'react'
import Drone from './Drone'

export default function DroneList(props) {

    const [data,setData] = useState(props.drones);
    const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();

    function handleUpdateTime(){
        const update = [...props.drones].filter(drone=>drone.id!==testSync());
        setData(update);
        setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
    }

    //only for testing
    function testSync(){
    //1 to 6
    let pick = Math.floor(Math.random() * 6) + 1;
    console.log("drop "+ pick);
    return pick;
    }


    function sorting(col){
        if(order==="ASC"){
            console.log("ASC");
            const sorted = [...data].sort((a,b)=>
            a[col].toLowerCase() > b[col].toLowerCase() ? 1: -1);
            setData(sorted);
            setOrder("DSC");
        }else if(order==="DSC"){
            console.log("DSC");
            const sorted = [...data].sort((a,b)=>
            a[col].toLowerCase() < b[col].toLowerCase() ? 1: -1);
            setData(sorted);
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
    <table>
        <thead>
        <tr>
            <th onClick={()=>{sorting("name");setOrderCol("name")}}>Name {showIcon("name")}</th>
            <th onClick={()=>{sorting("type");setOrderCol("type")}}>Type {showIcon("type")}</th>
            <th onClick={()=>{sorting("mac");setOrderCol("mac")}}>MAC {showIcon("mac")}</th>
        </tr>
        </thead>
        
        {data.map(drone=>{
            return <Drone key={drone.id} {...drone}></Drone> 
        })}
        
    </table>
    </div>
    </>
  ): ""
}
