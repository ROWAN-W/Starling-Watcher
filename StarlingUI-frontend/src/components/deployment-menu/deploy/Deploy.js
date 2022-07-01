import React, {useContext, useState, useEffect} from 'react';
import DeployPerNode from './DeployPerNode';
import { ProjectContext } from '../../App';

export default function Deploy(props) {

    const {handleProjectChange} = useContext(ProjectContext);
    const [selectedDrones, setSelectedDrones] = useState([]);
    const [deployFeedback, setDeployFeedback] = useState('');
    const [sync, setSync] = useState(false);
    const [deployWaiting, setDeployWaiting] = useState(false);
    

    useEffect(()=>{
        if(props.trigger===true){
            //if want keep previous mappings
            if(props.minimize!==null){
                console.log('if want keep previous mappings')
                let arrayDroneId = [];
                for(let i=0;i<props.selectedProject?.mapping.length;i++){
                console.log(props.selectedProject.mapping[i].mappedDrones);
                arrayDroneId = [...arrayDroneId,...props.selectedProject.mapping[i].mappedDrones];
                }
                console.log(arrayDroneId);
                setSelectedDrones(arrayDroneId);
            }
            //if want once sync, clear previous mappings
            else{
                console.log('clear previous mappings')
                props.handleUpdateTime();
                setSync(true);
                removeAllMappings();
                setDeployFeedback('');
            }
        }
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
            setDeployWaiting(true);
            setDeployFeedback('Deploying...');
            //faking server response
            setTimeout(() => {
                setDeployWaiting(false);
                setDeployFeedback('Success!');
            }, "2000")
            return true;
        }
        setDeployFeedback('Please specify at least one drone for each design/deployment');
        return false;
    }

    return (props.trigger) ? (
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                {!props.waiting && !deployWaiting && 
                <>
                <button className='popup-close-btn' onClick={()=>{props.setMinimize(null);props.setTrigger(false);
                }}>&times;</button>
                <button className='popup-hide-btn' onClick={()=>{props.setMinimize(true);props.setTrigger(false)}}>Min</button>
                </>}
                <h3>Deploy Configuration to Drones</h3>
                {!props.waiting &&
                    <>
                    {!deployWaiting && <div className='drone-update-time'><button onClick={()=>{setDeployFeedback('');props.handleUpdateTime();setSync(true);removeAllMappings()}}>Sync Available Devices</button></div>}
                    <div className='drone-update-time'>last sync: {props.updateTime}</div>
                    </>
                }             
                {props.waiting && <div>Please wait...</div>}
                {props.error && <div>No available devices</div>}

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
                <h4>{deployFeedback}</h4>
                {!props.waiting && !deployWaiting && 
                <div>
                <button onClick={()=>{finalCheck()}}>Deploy</button>
                <button onClick={()=>{props.setMinimize(null);props.setTrigger(false);
                }}>Close</button>
                </div>
                }     
            </div>
        </div>
      ): ""
}