import { useState,useEffect } from "react";
import React from "react";
import Popup from "./Popup";


export default function MonitorContainer(props){
    const [visible, setVisible] = useState(false);



    return(
        <>
            <div className="k8s-container">
                <div className="pole"></div>
                <div className="outer">
                    <h4>container name</h4>
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