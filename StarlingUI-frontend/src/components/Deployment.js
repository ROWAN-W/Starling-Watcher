import React, {useState, useContext} from "react";
import Menu from "./deployment-menu/Menu";
import Project from "./deployment-nodes/Project";
import ImageList from "./deployment-imageList/ImageList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroneList from "./deployment-droneList/DroneList";
import { ProjectContext } from './App';

function Deployment({currentUserID, selectedProject, updateProjectToData}) {

  const {handleProjectChange, handleProjectAdd, handleProjectDelete} = useContext(ProjectContext);
  const [data,setData] = useState();
  const [droneListTrigger,setDroneListTrigger] = useState(true);

  function handleChange(changes){
    handleProjectChange(selectedProject.id, {...selectedProject,...changes})
  }
  
  function showProjectTitle(){
    if(selectedProject===undefined){
      return <h1>Project Planning</h1>
    }else{
      return <div><input
      className="project-title"
      value={selectedProject.name}
      onChange={e=>handleChange({name: e.target.value})}></input></div>
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
        <DroneList trigger={droneListTrigger} setTrigger={setDroneListTrigger} data={data} setData={setData}></DroneList>
      )
    }
  }
  
  return (
    <>
    <div className="header">
    {showProjectTitle()}
    <div className="menu"><Menu selectedProject={selectedProject} updateProjectToData={updateProjectToData} handleProjectAdd={handleProjectAdd} handleProjectDelete={handleProjectDelete} drones={data}></Menu></div>
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
