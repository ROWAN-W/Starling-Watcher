
import React, {useEffect, useState} from "react";
import MonitorContainer from "./MonitorContainer";
import axios from "axios";


export default function MonitorPod(props){
    const [containers ,setContainers] = useState(null);
    const [reboot, setReboot] = useState(false);

    useEffect(() => {
        setContainers(props.containers);
    }, [props]);

    function change(){
        setReboot(true);
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
    return(
        <>
            <div className="pod">
                <div className="pod-info">
                    <h3 className="pod-name">{props.podName}</h3>
                    <button className="container-restart"
                            onClick={change}>Restart</button>
                </div>
                <div className="pod-container">
                    {containers?.map(container=>{
                        return <MonitorContainer
                            reboot={reboot}
                            namespace={props.namespace}
                            podName={props.podName}
                            {...container}></MonitorContainer>
                    })}
                </div>
            </div>
        </>
    )
}