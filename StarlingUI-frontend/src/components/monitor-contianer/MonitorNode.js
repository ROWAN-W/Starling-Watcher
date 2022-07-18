import MonitorContainer from "./MonitorContainer";
import React, {useEffect, useState} from "react";



export default function MonitorNode(props){
    const [containers ,setContainers] = useState(null);
    useEffect(() => {
        setContainers(props.containers);
    }, []);

    return(
        <>
            <div className="card">
                <div className="title">
                    <image className="drone-image"></image>
                    <span>{props.nodeName}</span>
                </div>
                <div className="card-container">
                    {containers?.map(container=>{
                        return <MonitorContainer {...container}></MonitorContainer>
                    })}
                </div>
            </div>
        </>
    )
}