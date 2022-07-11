import {Rnd} from "react-rnd";
import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {useEffect} from "react";
import ResizeObserver from "react-resize-observer";
import "xterm/css/xterm.css";


export default function Popup(props) {
    console.log(props);
    const fitAddon = new FitAddon();
    useEffect(() => {
        if (props.visible) {
            const terminal = new Terminal({
                convertEol: true,
                fontFamily: `'Fira Mono', monospace`,
                fontSize: 16,
                fontWeight: 400,
            });

            terminal.loadAddon(fitAddon);
            terminal.open(document.getElementById(props.id));
            fitAddon.fit();
        }
    });


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
                    <p>container-name</p>
                    <button className='close-btn' onClick={() => props.setVisible(false)}>close</button>
                </div>

                <div id={props.id} style={{height: "92%", width: "100%"}}></div>
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