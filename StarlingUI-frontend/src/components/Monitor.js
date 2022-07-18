import React from 'react'
import MonitorNode from './monitor-contianer/MonitorNode';
import { useEffect,useState } from "react";
import axios from "axios";


export default function Monitor() {

    const [data,setData] = useState(null);
    const [status, setStatus] = useState(200);

    const getNodeStatus = () => {
        axios.get('http://localhost:8080/monitor/nodes')
            .then(function (response) {
                setStatus(response.status);
                setData(response.data);
                console.log(data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    useEffect(() => {
        getNodeStatus();
    }, []);


  return (
      <>
        <div className="monitor">
          <div className="node-container-title">
              <h1>Drone status</h1>
              <button onClick={getNodeStatus}>sync</button>
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
