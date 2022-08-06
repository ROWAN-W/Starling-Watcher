import {useParams} from "react-router-dom";
import {FitAddon} from "xterm-addon-fit";
import {useEffect} from "react";
import {AttachAddon} from "xterm-addon-attach";
import {Terminal} from "xterm";


let socket;
let cols;
let rows;
const fitAddon = new FitAddon();
export default function ContainerLogs(){

    const { name,namespace,container } = useParams();

    useEffect(() => {
        cols=parseInt(document.body.clientWidth /9)
        rows=parseInt(document.body.clientHeight / 18)
        const logs = new Terminal({
            convertEol: true,
            cursorBlink: true,
            rows:rows,
            cols:cols,
            fontSize: 18,
            fontFamily: `'Fira Mono', monospace`,
            theme: {
                foreground: '#FFF',
            }
        });

            logs.open(document.getElementById("logs-container"));



            let url = 'ws://localhost:8080/container/logs';
            url += '?name=' + name
                + '&namespace=' + namespace
                + '&container=' + container

            // eslint-disable-next-line react-hooks/exhaustive-deps
            socket = new WebSocket(url);
            const attachAddon = new AttachAddon(socket);
            // Attach the socket to term
            logs.loadAddon(attachAddon);
            logs.loadAddon(fitAddon);
            fitAddon.fit()
        window.onresize = function (){
            fitAddon.fit()
            logs.scrollToBottom()
        }

    

    }, []);



    return(
        <>
            <div style={{padding: "0",border: "0",margin: "0"}}>
                <div id="logs-container"></div>
            </div>
        </>
    )
}