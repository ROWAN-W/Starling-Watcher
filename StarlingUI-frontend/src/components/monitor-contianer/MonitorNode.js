import MonitorContainer from "./MonitorContainer";
import {useState} from "react";
import React from "react";



export default function MonitorNode(){
    const [visible, setVisible] = useState(false);

    return(
        <>
            <div className="card">
                <h2 className="title">Drone Name</h2>
                <hr />
                <div className="card-container">
                    <MonitorContainer id='1'></MonitorContainer>
                    <MonitorContainer id='2'></MonitorContainer>
                    <MonitorContainer></MonitorContainer>
                </div>
            </div>
        </>
    )
}