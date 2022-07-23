import {useState, useEffect} from "react";
import React from "react";
import Popup from "./Popup";
import Logs from "./Logs";
import {BarLoader} from 'react-spinners';
import axios from "axios";



export default function MonitorContainer(props) {
    const [terminalVisible, setTerminalVisible] = useState(false);
    const [containerStatus, setContainerStatus] = useState("#32e6b7");
    const [buttonAvailable, setButtonAvailable] = useState(false);
    const [logsVisible, setLogsVisible] = useState(false);
    const [reboot, setReboot] = useState(false);

    const override = `
        display: block;
        margin: 0 auto;
    `;
    function change(){
        setReboot((prevState)=>!reboot);
        setTerminalVisible(false);
        setLogsVisible(false);
        let url = 'http://localhost:8080/monitor/restart/';
        url += props.namespace + '/' + props.podName;
        axios.delete(url)
            .then(function (response){
                console.log(response);
            })
            .catch(function (error){
                console.log(error);
            });

        setTimeout(()=>{
            props.getNodes();
            setReboot(false);
        },3000);
    }



    const style = {
        loading: reboot,
        size: 30,
        width:250,
        css:override,
        color: "#32e6b7",
    };

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

    const openTerminal = ()=>{
        const w=window.open('about:blank');
        let url = '/terminal';
        url += '/' + props.podName
            + '/' + props.namespace
            + '/' + props.containerName
        console.log(url);
        w.location.href=url;
    }



    return (
        <>
            <div className="k8s-container">
                <div className="pole"
                     style={{backgroundColor: containerStatus}}></div>
                <div className="outer">


                    <div className="container-info">
                        <p className="info-name">{props.containerName}</p>
                    </div>


                    {reboot?<BarLoader {...style} />:
                        <div className="button-list">
                            <div className="container-menu">
                                <button className="console-image"
                                        onClick={() => openTerminal()}
                                        disabled={buttonAvailable}></button>
                                <button className="container-logs"
                                        onClick={() => setLogsVisible(true)}
                                        disabled={buttonAvailable}></button>

                            </div>
                            <button className="container-restart"
                                    onClick={change}>Restart</button>
                        </div>



                    }


                    <Popup
                        terminalVisible={terminalVisible}
                        setVisible={setTerminalVisible}
                        id={props.containerName + props.namespace + "terminal"}
                        pod={props.podName}
                        namespace={props.namespace}
                        container={props.containerName}></Popup>
                    <Logs
                        LogsVisible={logsVisible}
                        setVisible={setLogsVisible}
                        id={props.containerName + props.namespace + "logs"}
                        pod={props.podName}
                        namespace={props.namespace}
                        container={props.containerName}></Logs>
                </div>
            </div>
        </>
    )
}