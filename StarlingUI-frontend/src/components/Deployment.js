import React, {useState, useContext} from "react";
import Menu from "./deployment-menu/Menu";
import Project from "./deployment-nodes/Project";
import ImageList from "./deployment-imageList/ImageList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroneList from "./deployment-droneList/DroneList";
import { ProjectContext } from './App';

function Deployment({selectedProject}) {

  const {currentUserID, handleProjectChange} = useContext(ProjectContext);
  
  const [droneListTrigger,setDroneListTrigger] = useState(true);
  //holding drones data!
  const [data,setData]=useState();

  const [updateClick, setUpdateClick] = useState(false);
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());

  
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

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
      return <h1>Project Planning</h1>
    }else{
      return <div><form><input
      className="project-title"
      value={selectedProject.name}
      required
      placeholder = "Your Project Name"
      maxLength = {40}
      onChange={e=>handleChange({name: e.target.value})}></input></form></div>
    }
  }

  function showDroneList(){
    //two columns
    if(droneListTrigger===false){
      return (
        <div><button onClick={()=>setDroneListTrigger(true)}>Drones</button> </div>       
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
    <div className="header">
    {showProjectTitle()}
    <div className="menu">
      <Menu 
      selectedProject={selectedProject} 
      drones={data} handleUpdateTime={handleUpdateTime} updateTime={updateTime} 
      error = {error} waiting = {waiting}
      ></Menu></div>
    </div>
    <div className="body">
        <DndProvider backend={HTML5Backend}>
        <ImageList></ImageList>
        <Project currentUserID={currentUserID} selectedProject={selectedProject} droneListTrigger={droneListTrigger}></Project>
        </DndProvider>
        {showDroneList()}
    </div>
    </>
  )
}

export default Deployment;
