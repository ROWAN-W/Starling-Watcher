import { Rnd } from "react-rnd";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
import { useEffect } from "react";


export default function Popup(props) {
    
    const fitAddon = new FitAddon();
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
        if (props.visible) {
            terminal.loadAddon(fitAddon);
            terminal.open(document.getElementById(props.id));
            setTimeout(() => {
                fitAddon.fit()
            }, 60)

            let url = 'ws://localhost:8080/container/shell';
            url += '?name=' + props.pod
                + '&namespace=' + props.namespace
                + '&container=' + props.container
                + '&cols=' + terminal.cols
                + '&rows=' + terminal.rows;
            console.log(url);
            socket = new WebSocket(url);
            const attachAddon = new AttachAddon(socket);
            // Attach the socket to term
            terminal.loadAddon(attachAddon);

        }
    });

    const closeShell = () => {
        socket.close();
        terminal.dispose();
        
        props.setVisible(false);
    }



    return (props.visible) ? (
        <>
            <Rnd
                className='popup-monitor'
                default={{
                    x: 0,
                    y: 0,
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