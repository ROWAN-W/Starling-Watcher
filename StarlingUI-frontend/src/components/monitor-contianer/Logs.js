import { Rnd } from "react-rnd";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
import {useEffect, useState} from "react";


export default function Logs(props) {

    const [state, setState] = useState(false);

    const logs = new Terminal({
        convertEol: true,
        cursorBlink: true,
        fontFamily: `'Fira Mono', monospace`,
        fontSize: 16,
        fontWeight: 400,
        theme: {
            foreground: '#FFF',
        }
    });
    let socket = null;


    useEffect(() => {
        if (props.LogsVisible&&state===false) {

            logs.open(document.getElementById(props.id));
            setState(true);


            let url = 'ws://localhost:8080/container/logs';
            url += '?name=' + props.pod
                + '&namespace=' + props.namespace
                + '&container=' + props.container
            console.log(url);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            socket = new WebSocket(url);
            const attachAddon = new AttachAddon(socket);
            // Attach the socket to term
            logs.loadAddon(attachAddon);
            const fitAddon = new FitAddon();
            logs.loadAddon(fitAddon);
            fitAddon.fit()
            console.log("1");
        }
    }, [props]);

    const closeLogs = () => {
        if(socket !== null){
            socket.close();
            logs.dispose();
        }
        props.setVisible(false);
        setState(false);
    }

    return (props.LogsVisible) ? (
        <>
            <Rnd
                className='popup-monitor'
                default={{
                    x: 0,
                    y: -150,
                    width: 400,
                    height: 250,
                }}
                bounds="body"
                enableResizing={false}
            >
                <div className='terminal-header'>
                    <p>{props.container+" - logs"}</p>
                    <button className='close-btn' onClick={() => closeLogs()}>X</button>
                </div>

                <div
                    className="logs"
                    id={props.id}
                    style={{ height: "92%", width: "100%" }}></div>

            </Rnd>
        </>
    ) : "";
}