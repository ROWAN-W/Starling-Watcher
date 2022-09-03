import React, {useState, useContext} from "react";
import Menu from "./deployment-menu/Menu";
import Project from "./deployment-nodes/Project";
import ImageList from "./deployment-imageList/ImageList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroneList from "./deployment-droneList/DroneList";
import { ProjectContext } from './App';
import DeployMini from "./deployment-menu/deploy/DeployMini";
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import edit from '../css/img/edit-svgrepo-com.svg';
import expand from '../css/img/left-arrow-svgrepo-com.svg';

function Deployment({selectedProject}) {

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: 'focus',
    placement: 'right-end',
  });

  const {handleProjectChange} = useContext(ProjectContext);
  
  const [droneListTrigger,setDroneListTrigger] = useState(true);
  //holding drones data!
  const [data,setData]=useState();

  const [updateClick, setUpdateClick] = useState(false);
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());

  
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

  const [minimize, setMinimize] = useState(null); //save

  function handleUpdateTime(){
    console.log("update available devices");
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
      <div className="whole">
        <input
        className="project-title input"
        value={selectedProject.name}
        placeholder = "Your Project Name"
        maxLength = {63}
        onChange={e=>handleChange({name: e.target.value})}
        ref={setTriggerRef}
        >
        </input>
        {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container project-name-hint' })}
        >
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          * only lowercase alphanumeric characters or '-'<br/>
          * start / end with an alphanumeric character<br/>
          * at most 63 characters<br/>
        </div>
        )}
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
        <Project selectedProject={selectedProject}></Project>
        </DndProvider>
        {showDroneList()}
    </main>
    {selectedProject!==undefined && <DeployMini trigger={minimize} setTrigger={setMinimize}></DeployMini>}
    </>
  )
}

export default Deployment;
