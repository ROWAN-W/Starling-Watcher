import React from 'react'
import MonitorNode from './monitor-contianer/MonitorNode';
import { useEffect,useState } from "react";
import axios from "axios";
import sync from '../components/img/sync-svgrepo-com.svg';
import logo from '../components/img/load.gif';

export default function Monitor() {

    const [data,setData] = useState(null);
    //added by Yulin, for sync time
    const [updateTime, setUpdateTime] = useState();
    //added by Yulin, for waiting transition / error result
    const [waiting, setWaiting] = useState(true);
    const [error, setError] = useState(null);

    const getNodeStatus = () => {
        axios.get('http://localhost:8080/monitor/nodes')
            .then(function (response) {
                setData(response.data);
                setWaiting(false);
                setError(null);
                console.log(data);
                setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
            })
            .catch(function (error) {
                setError(error);
                setWaiting(false);
                setData();
                console.log(error);
                setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
            });

    }

    useEffect(() => {
        getNodeStatus();
    }, []);


  return (
      <>
        <div className="monitor">
          <div className="node-container-title">
              <h1 className="drone-status-title">Drone status</h1>
              <div className='monitor-syn'>
                  {waiting && <div className='drone-update-time drone monitor'><img className="loading monitor" src={logo} alt="loading..." />Please wait...</div>}
                  {error && <div className='drone-update-time drone monitor error'><img className="syncing monitor" src={sync} alt="sync" title="sync" onClick={()=>getNodeStatus()}/>Failed to sync.</div>}
                  {data && <div className='drone-update-time drone monitor'><img className="syncing monitor" src={sync} alt="sync" title="sync" onClick={()=>getNodeStatus()}/>last sync: {updateTime}</div>}
              </div>
          </div>
          <div className="node-container">
              {data?.map(node=>{
                  return <MonitorNode {...node}></MonitorNode>
              })}
          </div>
        </div>
      </>
  );
}
