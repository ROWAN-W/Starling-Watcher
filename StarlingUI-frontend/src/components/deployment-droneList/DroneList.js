import React, { useState, useEffect } from 'react'
import Drone from './Drone'
import sync from './sync-svgrepo-com.svg';
import logo from '../load.gif';

export default function DroneList(props) {

    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();    

    useEffect(() => {
        const url = "http://localhost:8080/design/nodes";
          
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
    <div className='drone-container items'>
    <div className="items-head drone">
        <p>Available Devices</p>
        <hr/>
    </div>
    <button className='btn btn-small hide-drone btn-menu' onClick={()=>props.setTrigger(false)}>Hide</button>
    <button className='btn btn-small sync-drone btn-menu' onClick={()=>{props.handleUpdateTime();}}>{props.error? "Sync Again": "Sync"}</button>
    <div className='sync-time'>
        <div className='drone-update-time drone'><img className="syncing" src={sync} alt="sync" title="sync" onClick={()=>{props.handleUpdateTime();}}/>last sync: {props.updateTime}</div>
    </div>
    
    {props.waiting && <h4 className='wait-message docker'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
    {props.error && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{ props.error }</div>}
    
    <div className="table-wrapper">
    { (props.data ) &&
    <table className="fl-table">
        <thead>
        <tr>
            <th onClick={()=>{sorting("nodeName");setOrderCol("nodeName")}}>Name {showIcon("nodeName")}</th>
            <th onClick={()=>{sorting("hostname");setOrderCol("hostname")}}>Hostname {showIcon("hostname")}</th>
            <th onClick={()=>{sorting("ip");setOrderCol("ip")}}>IP Address {showIcon("ip")}</th>
            <th onClick={()=>{sorting("role");setOrderCol("role")}}>Role {showIcon("role")}</th>
        </tr>
        </thead>
        
        {props.data?.map(drone=>{
            return <Drone key={drone.id} {...drone}></Drone> 
        })}
        
    </table>}
    </div>
    </div>
    </>
  ): ""
}

//<th onClick={()=>{sorting("architecture");setOrderCol("architecture")}}>Architecture {showIcon("architecture")}</th>