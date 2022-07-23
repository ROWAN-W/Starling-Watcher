import { Rnd } from "react-rnd";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
import {useState,useEffect} from "react";


export default function Popup(props) {
    const [state, setState] = useState(false);

    const terminal = new Terminal({
        convertEol: true,
        cursorBlink: true,
        fontFamily: `'Fira Mono', monospace`,
        fontSize: 16,
        fontWeight: 400,
        theme: {
            foreground: '#32e6b7',
        }
    });
    let socket = null;

    useEffect(() => {
        if (props.terminalVisible&&state === false) {

            terminal.open(document.getElementById(props.id));
            setState(true);


            let url = 'ws://localhost:8080/container/shell';
            url += '?name=' + props.pod
                + '&namespace=' + props.namespace
                + '&container=' + props.container
                + '&cols=' + terminal.cols
                + '&rows=' + terminal.rows;
            console.log(url);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            socket = new WebSocket(url);
            const attachAddon = new AttachAddon(socket);
            // Attach the socket to term
            terminal.loadAddon(attachAddon);
            const fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            fitAddon.fit();
            console.log("2");
        }
    }, [props]);

    const closeShell = () => {
        if(socket !== null){
            socket.close();
            terminal.dispose();
        }
        props.setVisible(false);
        setState(false);
    }



    return (props.terminalVisible) ? (
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
                    <p>{props.container+" - terminal"}</p>
                    <button className='close-btn' onClick={() => closeShell()}>X</button>
                </div>

                <div
                    className="terminal"
                    id={props.id}
                    style={{ height: "92%", width: "100%" }}></div>

            </Rnd>
        </>
    ) : "";
}