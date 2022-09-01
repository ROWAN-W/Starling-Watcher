import React, {useEffect, useState} from "react";
import MonitorPod from "./MonitorPod";
import drone from "../../css/monitorImage/drone.png";


export default function MonitorNode(props){
    const [pods ,setPods] = useState(null);
    useEffect(() => {
        setPods(props.pods);
    }, [props]);

    

    return(
        <>
            <div className="card">
                <div className="title">
                    <img className="drone-image" src={drone} alt=""/>
                    <span>{props.nodeName}</span>
                </div>
                <div className="card-container">
                    {pods?.map(pod=>{
                        return <MonitorPod
                            getNodes={props.getNodes}
                            key={pod.id}
                            {...pod}></MonitorPod>
                    })}
                </div>
            </div>
        </>
    )
}
