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
                    <p>{props.nodeName}</p>
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