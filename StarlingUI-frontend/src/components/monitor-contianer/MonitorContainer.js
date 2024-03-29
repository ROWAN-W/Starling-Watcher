import { useState, useEffect } from "react";
import React from "react";
import { BarLoader } from 'react-spinners';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';


export default function MonitorContainer(props) {
    const [containerStatus, setContainerStatus] = useState("#32e6b7");
    const [buttonAvailable, setButtonAvailable] = useState(false);

    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: 'hover',
        placement: 'right-end',
    });

    const override = `
        display: block;
        margin: 0 auto;
    `;

    const style = {
        loading: props.reboot,
        size: 30,
        width: 250,
        css: override,
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

    const openTerminal = () => {
        const w = window.open('about:blank');
        let url = '/terminal';
        url += '/' + props.podName
            + '/' + props.namespace
            + '/' + props.containerName
        console.log(url);
        w.location.href = url;
    }

    const openLogs = () => {
        const w = window.open('about:blank');
        let url = '/logs';
        url += '/' + props.podName
            + '/' + props.namespace
            + '/' + props.containerName
        console.log(url);
        w.location.href = url;
    }


    return (
        <>
            <div className="k8s-container"
                
                ref={setTriggerRef}>
                <div className="pole"
                    style={{ backgroundColor: containerStatus }}
                    title={props.containerState}></div>
                <div className="outer">


                    <div className="container-info">
                        <p className="info-name" title={props.containerName}>{props.containerName}</p>
                    </div>


                    {props.reboot ? <BarLoader {...style} /> :
                        <div className="button-list">
                            <button className="console-image"
                                onClick={() => openTerminal()}
                                disabled={buttonAvailable}></button>
                            <button className="container-logs"
                                onClick={() => openLogs()}
                                ></button>
                        </div>
                    }
                </div>
            </div>
            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: 'tooltip-container project-name-hint' })}
                >
                    <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                    * Container has three state:<br />
                    * Green:Running<br />
                    * Yello:Waiting(The container is in queue for startup, please wait.)<br />
                    * Red:Terminated(The container will restart automatically when it has a terminated state. Please wait.) <br />
                </div>
            )}
        </>
    )
}