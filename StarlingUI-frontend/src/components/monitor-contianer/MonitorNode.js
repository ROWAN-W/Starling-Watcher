import MonitorContainer from "./MonitorContainer";



export default function MonitorNode(){

    return(
        <>
            <div className="card">
                <h2 className="title">Drone Name</h2>
                <hr />
                <div className="card-container">
                    <MonitorContainer></MonitorContainer>
                    <MonitorContainer></MonitorContainer>
                    <MonitorContainer></MonitorContainer>
                </div>
            </div>
        </>
    )
}