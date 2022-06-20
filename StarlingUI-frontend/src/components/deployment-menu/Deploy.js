import React, {useContext, useState, useEffect} from 'react';
import DeployPerNode from './DeployPerNode';
import { ProjectContext } from '../App';

export default function Deploy(props) {

    const {handleProjectChange} = useContext(ProjectContext);
    const [selectedDrones, setSelectedDrones] = useState([]);

    useEffect(()=>{
        console.log("rendered in deploy");
      },[props.drones, props.selectedProject]);
    

    function handleChange(changes){
    handleProjectChange(props.selectedProject.id, {...props.selectedProject,...changes});
    }

    function handleMappingChange(nodeID, mappingItem){
        const newNodes = [...props.selectedProject.mapping];
        const index = newNodes.findIndex(i=>i.nodeID===nodeID);
        newNodes[index] = mappingItem;
        handleChange({mapping:newNodes});
    }
    
    return (props.trigger) ? (
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);}}>&times;</button>
                <h3>Deploy Configuration to Drones</h3>
                {props.selectedProject.mapping.map(node=>{
                    const completeNode = props.selectedProject.config.find(n=>n.id===node.nodeID)
                    return(
                        <DeployPerNode key={node.nodeID} 
                        completeNode={completeNode} 
                        nodeToMap={node} 
                        allDrones={props.drones} 
                        handleMappingChange={handleMappingChange}
                        selectedDrones={selectedDrones}
                        setSelectedDrones={setSelectedDrones}
                        ></DeployPerNode>
                    ) 
                })}
                <div>
                <button onClick={()=>{props.setTrigger(false);props.updateProjectToData()}}>Deploy</button>
                <button onClick={()=>{props.setTrigger(false);}}>Close</button>
                </div>
            </div>
        </div>
      ): ""
    }