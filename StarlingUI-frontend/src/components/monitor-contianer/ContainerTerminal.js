import { useParams } from "react-router-dom"
import {Terminal} from "xterm";
import {AttachAddon} from "xterm-addon-attach";
import {FitAddon} from "xterm-addon-fit";
import {useEffect} from "react";

let socket;
let cols;
let rows;
const fitAddon = new FitAddon();
export default function ContainerTerminal(){


    const { name,namespace,container } = useParams();
    //console.log(name,namespace,container);




    useEffect(() => {
        cols=parseInt(document.body.clientWidth /9)
        rows=parseInt(document.body.clientHeight / 18)
        const terminal = new Terminal({
            convertEol: true,
            cursorBlink: true,
            rows:rows,
            cols:cols,
            fontSize: 18,
            fontFamily: `'Fira Mono', monospace`,
            theme: {
                foreground: '#32e6b7',
            }
        });


        terminal.open(document.getElementById("terminal-container"));


        let url = 'ws://localhost:8080/container/shell';
        url += '?name=' + name
            + '&namespace=' + namespace
            + '&container=' + container
            + '&cols=' + cols
            + '&rows=' + rows;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        socket = new WebSocket(url);

        const attachAddon = new AttachAddon(socket);
        // Attach the socket to term
        terminal.loadAddon(attachAddon);
        terminal.loadAddon(fitAddon);
        fitAddon.fit();

        const debounce = (fn, delay) => {
            let timer;
            return function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    fn();
                }, delay);
            }
        };

        function resize() {
            if(socket !== null){
                fitAddon.fit();
                terminal.scrollToBottom()
                cols=parseInt(document.body.clientWidth /9)
                rows=parseInt(document.body.clientHeight / 18)
                socket.send("stty cols " + cols + " rows "+ rows + " ");
                console.log("stty cols " + cols + " rows "+ rows + " ");
            }

        }
        window.addEventListener("resize", debounce(resize,1000))

        
    },[]);





    return(
        <>
            <div style={{padding: "0",border: "0",margin: "0"}}>
                <div id="terminal-container"></div>
            </div>
        </>
    )
}