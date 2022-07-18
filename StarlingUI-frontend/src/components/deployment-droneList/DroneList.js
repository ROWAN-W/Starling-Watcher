import React, { useState, useEffect } from 'react'
import Drone from './Drone'
import sync from '../img/sync-svgrepo-com.svg';
import logo from '../img/load.gif';
import SearchType from './SearchType';
import DroneSearchBox from './DroneSearchBox';

export default function DroneList(props) {

    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState();  
    
    const [searchType, setSearchType] = useState('nodeName');
    const [searchDrone, setSearchDrone] = useState('');

    useEffect(() => {
        const url = "http://localhost:8080/design/nodes";
        //http://localhost:8080/design/nodes
        //http://localhost:8002/sampleDrone
          
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

    function showResult(){
        if(searchDrone===''){
            return props.data;
        }
        else{
            if(searchType!=='labels' && searchType!=='annotations'){
                return props.data.filter(i=>i[searchType].toLowerCase().includes(searchDrone.toLowerCase())); 
            }
            else{
                console.log(Object.values(props.data[0][searchType]));
                return props.data.filter(i=>Object.values(i[searchType]).includes(searchDrone.toLowerCase())); 
            }
            
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
    <button className='btn btn-small sync-drone btn-menu' onClick={()=>{props.handleUpdateTime();}}>Sync</button>
    <div className='sync-time'>
        <div className='drone-update-time drone'><img className="syncing" src={sync} alt="sync" title="sync" onClick={()=>{props.handleUpdateTime();}}/>last sync: {props.updateTime}</div>
    </div>
    
    {props.waiting && <h4 className='wait-message docker'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
    {props.error && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{ props.error }</div>}
    
    <div className="table-wrapper">
        {(props.data ) && <div className='drone-list-search'>
            <SearchType searchType={searchType} setSearchType={setSearchType}></SearchType>
            <DroneSearchBox setSearchDrone={setSearchDrone} searchDrone={searchDrone}></DroneSearchBox>
        </div>}
    { (props.data ) &&
    <table className="fl-table wordwrap wordbreak">
        <thead>
        <tr>
            <th onClick={()=>{sorting("nodeName");setOrderCol("nodeName")}}>Name {showIcon("nodeName")}</th>
            <th onClick={()=>{sorting("hostname");setOrderCol("hostname")}}>Host {showIcon("hostname")}</th>
            <th onClick={()=>{sorting("ip");setOrderCol("ip")}}>IP {showIcon("ip")}</th>
            <th onClick={()=>{sorting("role");setOrderCol("role")}}>Role {showIcon("role")}</th>
        </tr>
        </thead>
        
        {showResult()?.map(drone=>{
            return <Drone key={drone.id} {...drone}></Drone> 
        })}
        
    </table>}
    </div>
    </div>
    </>
  ): ""
}

//<th onClick={()=>{sorting("architecture");setOrderCol("architecture")}}>Architecture {showIcon("architecture")}</th>