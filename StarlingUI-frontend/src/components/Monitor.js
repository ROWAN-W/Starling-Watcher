import React from 'react'
import MonitorNode from './monitor-contianer/MonitorNode';


export default function Monitor(props) {

    const nodes = () => props.type;

  return (
      <>
        <div className="monitor">
          <div className="node-container-title"><h1>Drone status</h1></div>
          <div className="node-container">
            <MonitorNode></MonitorNode>
            <MonitorNode></MonitorNode>
            <MonitorNode></MonitorNode>
            <MonitorNode></MonitorNode>
            <MonitorNode></MonitorNode>
          </div>
        </div>
      </>
  )
}
