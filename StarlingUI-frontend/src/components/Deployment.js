import React, {useState, useContext} from "react";
import Menu from "./deployment-menu/Menu";
import Project from "./deployment-nodes/Project";
import ImageList from "./deployment-imageList/ImageList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroneList from "./deployment-droneList/DroneList";
import { ProjectContext } from './App';
import DeployMini from "./deployment-menu/deploy/DeployMini";
import edit from './img/edit-svgrepo-com.svg';
import expand from './img/left-arrow-svgrepo-com.svg';

function Deployment({selectedProject}) {

  const {currentUserID, handleProjectChange} = useContext(ProjectContext);
  
  const [droneListTrigger,setDroneListTrigger] = useState(true);
  //holding drones data!
  const [data,setData]=useState();

  const [updateClick, setUpdateClick] = useState(false);
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());

  
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

  const [minimize, setMinimize] = useState(null); //save

  function handleUpdateTime(){
    setWaiting(true);
    setError(null);
    setData(); //clear data
    setUpdateClick(prev=>!prev);
    setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
  }

  function handleChange(changes){
    handleProjectChange(selectedProject.id, {...selectedProject,...changes})
  }
  
  function showProjectTitle(){
    if(selectedProject===undefined){
      return <h1 className="project-title plan">Project Planning</h1>
    }else{
      return (
      <div>
        <input
        className="project-title input"
        value={selectedProject.name}
        required
        placeholder = "Your Project Name"
        maxLength = {63}
        onChange={e=>handleChange({name: e.target.value})}></input>
        <img className="edit-icon" src={edit} alt="edit" title="edit project name"/>
      </div>
      )
    }
  }

  //<div><img className="arrow" src={arrow} alt="show available devices" title="show available devices" onClick={()=>setDroneListTrigger(true)}/>
        //</div>

  function showDroneList(){
    //two columns
    if(droneListTrigger===false){
      return (
        <button className="openbtn" onClick={()=>setDroneListTrigger(true)}><span><img className="expand-icon" src={expand} alt="expand" title="show devices"/>Device List</span></button> 
      ) 
    //three columns //true
    }else{
      return (
        <DroneList trigger={droneListTrigger} setTrigger={setDroneListTrigger} 
        data={data} setData={setData} 
        handleUpdateTime={handleUpdateTime}
        updateClick={updateClick}
        updateTime={updateTime}
        waiting = {waiting}
        setWaiting = {setWaiting}
        error = {error}
        setError = {setError}
        ></DroneList>
      )
    }
  }

  
  return (
    <>
    <header className="header-menu">
    {showProjectTitle()}
      <Menu 
      selectedProject={selectedProject} 
      drones={data} handleUpdateTime={handleUpdateTime} updateTime={updateTime} 
      error = {error} waiting = {waiting}
      minimize = {minimize} setMinimize={setMinimize}
      ></Menu>
    </header>
    <main className="main-body">
        <DndProvider backend={HTML5Backend}>
        <ImageList></ImageList>
        <Project currentUserID={currentUserID} selectedProject={selectedProject}></Project>
        </DndProvider>
        {showDroneList()}
    </main>
    {selectedProject!==undefined && <DeployMini trigger={minimize} setTrigger={setMinimize}></DeployMini>}
    </>
  )
}

export default Deployment;
