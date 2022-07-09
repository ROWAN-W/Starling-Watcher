import { useState,useEffect } from "react";
import React from "react";
import Popup from "./Popup";


export default function MonitorContainer(props){
    const [visible, setVisible] = useState(false);
    console.log(props);



    return(
        <>
            <div className="k8s-container">
                <div className="pole"></div>
                <div className="outer">
                    <div className="container-info">
                        <p className="info-name">{props.containers[0].containerName}</p>
                        <p className="info-id">{props.containers[0].containerID}</p>
                    </div>

                    <div className="menu">
                        <button onClick={()=>setVisible(true)}>Console</button>
                        <button>Logs</button>
                        <button>Restart</button>
                    </div>
                    <Popup visible={visible} setVisible={setVisible} id={props.id}></Popup>
                </div>
            </div>
        </>
    )
}