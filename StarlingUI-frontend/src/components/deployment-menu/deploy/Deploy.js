import React, {useContext, useState, useEffect} from 'react';
import DeployPerNode from './DeployPerNode';
import { ProjectContext } from '../../App';
import axios from 'axios';
import logo from '../../img/load.gif';
import syncLogo from '../../img/sync-svgrepo-com-black.svg';
const DEPLOY_URL = 'http://localhost:8080/design/templating';

export default function Deploy(props) {

    const {handleProjectChange,handleCurrentUser} = useContext(ProjectContext);
    const [selectedDrones, setSelectedDrones] = useState([]);
    const [deployFeedback, setDeployFeedback] = useState('');
    const [sync, setSync] = useState(false);
    const [deployWaiting, setDeployWaiting] = useState(false);
    const [reLogin, setReLogin] = useState(false);

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

            axios.post(DEPLOY_URL, props.selectedProject)
            .then(res => {
                console.log(res.data);
                setDeployWaiting(false);
                setDeployFeedback('Success! Please check out in the monitor page');
            })
            .catch(err => {
                setDeployWaiting(false);
                if(err.response.status===401){
                    setDeployFeedback("Authentication is required. Please sign in again.");
                    setReLogin(true);
                }
                else if(err.response.status===400){
                    setDeployFeedback("Fail to deploy");
                }
                else{
                    setDeployFeedback(err.message);
                }
            })

            return true;
        }
        setDeployFeedback('Please specify at least one drone for each design/deployment');
        return false;
    }

    function showFeedback(){
        if(deployFeedback===''){
            return;
        }

        if(deployFeedback==='Deploying...'){
            return(
                <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />{deployFeedback}</h4>
            )
        }
        else if(deployFeedback==='Success! Please check out in the monitor page'){
            return(
                <div className="success-msg wordwrap"><i className="fa fa-check"></i>{deployFeedback}</div>
            )
        }
        else if(deployFeedback==='Authentication is required. Please sign in again.'||deployFeedback==='Fail to deploy'){
            return(
                <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{deployFeedback}</div>
            )
        }
        else{
            return(
                <div className="warning-msg wordwrap"><i className="fa fa-warning"></i>{deployFeedback}</div>
            )
        }
    }

    function authenticateAgain(){
        if(reLogin){
          handleCurrentUser(undefined);
          setReLogin(false);
        }
    }

    return (props.trigger) ? (
        <div className='popup-projects'>
            <div className='popup-projects-inner'>                
                <div className='popup-header'>
                    <span className='popup-title'>Deploy Configurations to Devices</span>
                    {!props.waiting && !deployWaiting && 
                    <div>
                    <button className='popup-close-button hide' onClick={()=>{props.setMinimize(true);props.setTrigger(false)}}>—</button>
                    <button className='popup-close-button' onClick={()=>{props.setMinimize(null);props.setTrigger(false);authenticateAgain()}}>&times;</button>
                    </div>}
                </div>
                {!props.waiting &&
                    <div className='sync-time'>
                    {!deployWaiting && <img className="syncing" src={syncLogo} alt="sync" title="sync" onClick={()=>{setDeployFeedback('');props.handleUpdateTime();setSync(true);removeAllMappings()}}></img>}
                    <span>last sync: {props.updateTime}</span>
                    </div>
                }
                <div className='deploy'>
                {props.error && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>No available devices</div>}
                {props.waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
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
                </div>
                {showFeedback()}
                                
                {!props.waiting && !deployWaiting && 
                <div className='popup-footer normal deploy-display'>
                <button className='btn btn-primary' onClick={()=>{finalCheck()}}>Deploy</button>
                <button className='btn btn-cancel' onClick={()=>{props.setMinimize(null);props.setTrigger(false);authenticateAgain()}}>Cancel</button>
                </div>
                }
                     
            </div>
        </div>
      ): ""
}