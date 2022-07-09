import MonitorContainer from "./MonitorContainer";
import React, {useEffect, useState} from "react";



export default function MonitorNode(props){
    const [containers ,setContainers] = useState(null);
    useEffect(() => {
        setContainers(props.Pods);
    }, []);

    return(
        <>
            <div className="card">
                <h2 className="title">{props.nodeName}</h2>
                <hr />
                <div className="card-container">
                    {containers?.map(container=>{
                        return <MonitorContainer {...container}></MonitorContainer>
                    })}
                </div>
            </div>
        </>
    )
}