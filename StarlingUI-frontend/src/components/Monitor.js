import React from 'react'
import MonitorNode from './monitor-contianer/MonitorNode';
import { useEffect, useState } from "react";
import axios from "axios";


export default function Monitor() {

    const [data, setData] = useState(null);
    const [state, setstate] = useState(200);

    const getNodeStatus = () => {
        axios.get('http://localhost:8080/monitor/nodes')
            .then(function (response) {
                setData(response.data);
                setstate(response.status);
                console.log(state);

            })
            .catch(function (error) {
                setstate(error.response.data.status);
                console.log(error);
                console.log(error.response.data.status);

            });

    }

    useEffect(() => {
        getNodeStatus();
        const interval = setInterval(
            () => { getNodeStatus(); }, 30000
        )
        return () => clearInterval(interval)
    }, []);


    function showData() {
        if (state === 200) {
            return (
                <div className="node-container">
                    {data?.map(node => {
                        return <MonitorNode getNodes={getNodeStatus} {...node}></MonitorNode>
                    })}
                </div>
            )
        } else if (state === 500) {
            return (
                <>
                    
                    <h1 className='monitor-error'>No cluster found !!!</h1>
                    
                </>
            )
        } else {
            return (
                <>
                    <h1 className='monitor-error'>Fetch failed,Resending request...</h1>
                    <p className='error-message'>error: {data}</p>
                </>
            )
        }
    }

    return (
        <>
            <div className="monitor">
                {showData()}
            </div>
        </>
    );
}
