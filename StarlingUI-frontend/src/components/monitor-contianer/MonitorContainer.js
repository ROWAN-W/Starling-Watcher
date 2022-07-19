import { useState,useEffect } from "react";
import React from "react";
import Popup from "./Popup";
import Logs from "./Logs";


export default function MonitorContainer(props){
    const [terminalVisible, setTerminalVisible] = useState(false);
    const [containerStatus, setContainerStatus] = useState("#32e6b7");
    const [buttonAvailable,setButtonAvailable] = useState(false);
    const [logsVisible, setLogsVisible] = useState(false);
    let containerId = null;
    if(props.containerID !== null){
        containerId = props.containerID.slice(9);
    }


    useEffect(() => {
        // eslint-disable-next-line default-case
        switch (props.containerState) {
            case "running":
                setContainerStatus("#32e6b7");
                setButtonAvailable(false);
                break;
            case "null":
            case "terminated":
                setContainerStatus("#dc5671");
                setButtonAvailable(true);
                break;
            case "waiting":
                setContainerStatus("#EEC908");
                setButtonAvailable(true);
                break;
        }

    }, [props]);



    return(
        <>
            <div className="k8s-container">
                <div className="pole"
                    style={{backgroundColor: containerStatus,}}></div>
                <div className="outer">
                    <div className="container-info">
                        <p className="info-name">{props.containerName}</p>
                        <p className="info-id">{containerId}</p>
                    </div>

                    <div className="container-menu">

                        <button className="console-image"
                                onClick={()=>setTerminalVisible(true)}
                                disabled={buttonAvailable}></button>
                        <button className="container-logs"
                                onClick={()=>setLogsVisible(true)}
                                disabled={buttonAvailable}></button>

                    </div>
                    <button className="container-restart"
                            disabled={!buttonAvailable}>Restart</button>

                    <Popup
                        terminalVisible={terminalVisible}
                        setVisible={setTerminalVisible}
                        id={props.containerName+props.namespace+"terminal"}
                        pod={props.podName}
                        namespace={props.namespace}
                        container={props.containerName}></Popup>
                    <Logs
                        LogsVisible={logsVisible}
                        setVisible={setLogsVisible}
                        id={props.containerName+props.namespace+"logs"}
                        pod={props.podName}
                        namespace={props.namespace}
                        container={props.containerName}></Logs>
                </div>
            </div>
        </>
    )
}