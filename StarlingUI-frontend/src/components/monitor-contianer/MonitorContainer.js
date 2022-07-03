
export default function MonitorContainer(){

    return(
        <>
            <div className="k8s-container">
                <div className="pole"></div>
                <div className="outer">
                    <h4>container name</h4>
                    <div className="menu">
                        <button>Console</button>
                        <button>Logs</button>
                        <button>Restart</button>
                    </div>
                </div>
            </div>
        </>
    )
}