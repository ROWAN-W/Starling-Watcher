import React, {useContext, useState, useEffect} from 'react';
import DeployPerNode from './DeployPerNode';
import { ProjectContext } from '../../App';

export default function Deploy(props) {

    const {handleDeployedProject, handleProjectChange} = useContext(ProjectContext);
    const [selectedDrones, setSelectedDrones] = useState([]);
    const [deployFeedback, setDeployFeedback] = useState('');
    const [sync, setSync] = useState(false);

    useEffect(()=>{
        console.log("rendered in deploy");
        let arrayDroneId = [];
        for(let i=0;i<props.selectedProject?.mapping.length;i++){
            console.log(props.selectedProject.mapping[i].mappedDrones);
            arrayDroneId = [...arrayDroneId,...props.selectedProject.mapping[i].mappedDrones];
        }
        console.log(arrayDroneId);
        setSelectedDrones(arrayDroneId);
      },[props.trigger]);
    

    function handleChange(changes){
    handleProjectChange(props.selectedProject.id, {...props.selectedProject,...changes});
    }

    function handleMappingChange(nodeID, mappingItem){
        const newNodes = [...props.selectedProject.mapping];
        const index = newNodes.findIndex(i=>i.nodeID===nodeID);
        newNodes[index] = mappingItem;
        handleChange({mapping:newNodes});
    }

    function removeAllMappings(){
        let newNodes = [];
        for(let i=0;i<props.selectedProject.config.length;i++){
            const newNode = {
                nodeID: props.selectedProject.config[i].id,
                mappedDrones: []
            };
            newNodes = [...newNodes,newNode];
        }
        handleChange({mapping:newNodes});
    }

    function finalCheck(){
        if(props.drones){
            for(let i=0;i<props.selectedProject.mapping.length;i++){
                if(props.selectedProject.mapping[i].mappedDrones.length==0){
                    setDeployFeedback('Please specify at least one drone for each design/deployment');
                    return false;
                }
            }
            setDeployFeedback('Deploying...');
            //faking server response
            setTimeout(() => {
                setDeployFeedback('Success!');
                handleDeployedProject(props.selectedProject.id);
            }, "2000")
            return true;
        }
        setDeployFeedback('Please specify at least one drone for each design/deployment');
        return false;
    }


    return (props.trigger) ? (
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setDeployFeedback('')}}>&times;</button>
                <h3>Deploy Configuration to Drones</h3>
                
                <div className='drone-update-time'><button onClick={()=>{props.handleUpdateTime();setSync(true);removeAllMappings()}}>Sync Available Drones</button></div>
                <div className='drone-update-time'>last sync: {props.updateTime}</div>
                
                {<div>{props.updateMes}</div>}
                
                {props.selectedProject.mapping.map(node=>{
                    //for displaying node name
                    const completeNode = props.selectedProject.config.find(n=>n.id===node.nodeID)
                    return(
                        <DeployPerNode key={node.nodeID} 
                        completeNode={completeNode} 
                        nodeToMap={node} 
                        allDrones={props.drones} 
                        handleMappingChange={handleMappingChange}
                        selectedDrones={selectedDrones}
                        setSelectedDrones={setSelectedDrones}
                        sync = {sync}
                        setSync = {setSync}
                        ></DeployPerNode>
                    ) 
                })}
                {deployFeedback}
                <div>
                <button onClick={()=>{finalCheck()}}>Deploy</button>
                <button onClick={()=>{props.setTrigger(false);setDeployFeedback('')}}>Close</button>
                </div>
            </div>
        </div>
      ): ""
}

//props.updateProjectToData()

    /**
     * { (drones) &&
                props.selectedProject.mapping.map(node=>{
                    const completeNode = props.selectedProject.config.find(n=>n.id===node.nodeID)
                    return(
                        <>
                        <div><button onClick={()=>{handleUpdateTime();}}>Sync</button></div>
                        <div className='drone-update-time'>last sync: {updateTime}</div>
                        <DeployPerNode key={node.nodeID} 
                        completeNode={completeNode} 
                        nodeToMap={node} 
                        allDrones={drones} 
                        handleMappingChange={handleMappingChange}
                        selectedDrones={selectedDrones}
                        setSelectedDrones={setSelectedDrones}
                        ></DeployPerNode>
                        <div>
                        <button onClick={()=>{props.setTrigger(false);setResult('')}}>Deploy</button>
                        <button onClick={()=>{props.setTrigger(false);setResult('')}}>Close</button>
                        </div>
                        </>
                    ) 
                })}
     */