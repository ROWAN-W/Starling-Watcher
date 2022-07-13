import { Rnd } from "react-rnd";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
import { useEffect, useState } from "react";
import ResizeObserver from "react-resize-observer";
import "xterm/css/xterm.css";


export default function Popup(props) {
    
    const fitAddon = new FitAddon();
    const terminal = new Terminal({
        convertEol: true,
        fontFamily: `'Fira Mono', monospace`,
        fontSize: 16,
        fontWeight: 400,
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
                className='popup'
                default={{
                    x: 0,
                    y: 0,
                    width: 600,
                    height: 400,
                }}
            >
                <div className='terminal-header'>
                    <p>{props.container+"terminal"}</p>
                    <button className='close-btn' onClick={() => closeShell()}>close</button>
                </div>

                <div id={props.id} style={{ height: "100%", width: "100%" }}></div>
                <ResizeObserver
                    onResize={rect => {
                        fitAddon.fit();
                        console.log("Resized. New bounds:", rect.width, "x", rect.height);
                    }}
                    onPosition={rect => {
                        console.log("Moved. New position:", rect.left, "x", rect.top);
                    }}
                />
            </Rnd>
        </>
    ) : "";
}