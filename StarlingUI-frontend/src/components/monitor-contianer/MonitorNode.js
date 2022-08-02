import MonitorContainer from "./MonitorContainer";
import React, {useEffect, useState} from "react";
import MonitorPod from "./MonitorPod";



export default function MonitorNode(props){
    const [pods ,setPods] = useState(null);
    useEffect(() => {
        setPods(props.pods);
    }, [props]);

    return(
        <>
            <div className="card">
                <div className="title">
                    <image className="drone-image"></image>
                    <span>{props.nodeName}</span>
                </div>
                <div className="card-container">
                    {pods?.map(pod=>{
                        return <MonitorPod
                            getNodes={props.getNodes}
                            {...pod}></MonitorPod>
                    })}
                </div>
            </div>
        </>
    )
}