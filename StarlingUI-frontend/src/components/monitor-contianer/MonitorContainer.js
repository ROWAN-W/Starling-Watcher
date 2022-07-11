import { useState,useEffect } from "react";
import React from "react";
import Popup from "./Popup";


export default function MonitorContainer(props){
    const [terminalVisible, setTerminalVisible] = useState(false);
    const [containerStatus, setContainerStatus] = useState("green");
    const [buttonAvailable,setButtonAvailable] = useState(false);
    console.log(props);

    useEffect(() => {
        switch (props.containerState) {
            case "running":
                setContainerStatus("green");
                setButtonAvailable(false);
                break;
            case "terminated":
                setContainerStatus("red");
                setButtonAvailable(true);
                break;
            case "waiting":
                setContainerStatus("yellow");
                setButtonAvailable(true);
                break;
        }

    }, [props]);



    return(
        <>
            <div className="k8s-container">
                <div className="pole"
                    style={{backgroundColor: containerStatus}}></div>
                <div className="outer">
                    <div className="container-info">
                        <p className="info-name">{props.containerName}</p>
                        <p className="info-id">{props.containerID}</p>
                    </div>

                    <div className="menu">
                        <button
                            onClick={()=>setTerminalVisible(true)}
                            disabled={buttonAvailable}>Console</button>
                        <button>Logs</button>
                        <button>Restart</button>
                    </div>
                    <Popup
                        visible={terminalVisible}
                        setVisible={setTerminalVisible}
                        id={props.containerName+props.namespace}
                        pod={props.podName}
                        namespace={props.namespace}
                        container={props.containerName}></Popup>
                </div>
            </div>
        </>
    )
}