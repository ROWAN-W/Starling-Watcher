import React, {useState} from 'react'
import NodeEnvEdit from './NodeEnvEdit';
import { v4 as uuidv4 } from 'uuid';
import NodePortEdit from './NodePortEdit';
import add from '../img/add-svgrepo-com.svg';

export default function ContainerSetting(props) {

    const [command, setCommand] = useState(props.container.command);
    const [args, setArgs] = useState(props.container.args);    
    const [envs, setEnvs] = useState([...props.container.env]);
    const [ports, setPorts] = useState([...props.container.port]);

    function clearField(){
        setCommand(props.container.command);
        setArgs(props.container.args);
        setEnvs([...props.container.env]);
        setPorts([...props.container.port]);
        console.log("recover");
    }

    function handleChange(changes){
        props.handleContainerChange(props.container.id, {...props.container, ...changes})
    }

    /*function saveChange(){
        handleChange({command:command,args: args, env: envs, port: ports});
        props.setTrigger(false);
    }*/

    const saveChange = (e) => {
        e.preventDefault();
        handleChange({command:command,args: args, env: envs, port: ports});
        props.setTrigger(false);
    }

    function handleEnvChange(id, variable){
        const newEnvs = [...envs];
        const index = newEnvs.findIndex(i=>i.id===id);
        newEnvs[index] = variable;
        setEnvs(newEnvs);
    }

    function handleEnvAdd(){
        const newEnv = {
            id: uuidv4(),
            name: '',
            value: ''
        }
        setEnvs([...envs, newEnv]);
    }

    function handleEnvDelete(id){
        setEnvs(envs.filter(i=> i.id !== id));
    }

    function handlePortChange(id, port){
        const newPorts = [...ports];
        const index = newPorts.findIndex(i=>i.id===id);
        newPorts[index] = port;
        setPorts(newPorts);
    }

    function handlePortAdd(){
        const newPort = {
            id: uuidv4(),
            containerPort: '',
            protocol: ''
        }
        setPorts([...ports, newPort]);
    }

    function handlePortDelete(id){
        setPorts(ports.filter(i=> i.id !== id));
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner advanced-setting'>
            <div className='popup-header'>
                <span className='popup-title'>Advanced Settings</span>
                <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
            </div>
                <form onSubmit={saveChange} className="advanced-setting-form">
                    <div className="advanced-setting stack">
                    <div className='popup-major stack'>
                    <label 
                        htmlFor='command' className='popup-major-key major'>command
                    </label>
                    <input 
                        type='text' 
                        name='command' 
                        id='command'
                        value={command}
                        onChange={e=>setCommand(e.target.value)}
                        className="width-100"
                        >
                    </input>
                    <label 
                        htmlFor='command' className='popup-major-key major'>args
                    </label>
                    <input 
                        type='text' 
                        name='args' 
                        id='args'
                        value={args}
                        onChange={e=>setArgs(e.target.value)}
                        className="width-100"
                        >
                    </input>
                    </div>
                    <div className='sub-title grid'><label>Env</label>
                    <img className="add" src={add} alt="add" title="Add Env Property" onClick={()=>handleEnvAdd()}/></div>
                    <div className='popup-pair-grid'>
                    <div className='popup-major-key'>Name</div>
                    <div className='popup-major-key'>Value</div>
                    <div></div>
                    {envs.map(variable=>
                    <NodeEnvEdit 
                    key={variable.id} 
                    handleEnvChange = {handleEnvChange}
                    handleEnvDelete = {handleEnvDelete}
                    variable={variable}
                    ></NodeEnvEdit>
                    )}
                    </div>

                    <p></p>
                    <div className='sub-title grid'><label>Port</label>
                    <img className="add port" src={add} alt="add" title="Add Port Property" onClick={()=>handlePortAdd()}/></div>
                    <div className='popup-pair-grid'>
                    <div className='popup-major-key'>Port Number</div>
                    <div className='popup-major-key'>Protocol</div>
                    <div></div>
                    {ports.map(p=>
                    <NodePortEdit
                    key={p.id} 
                    handlePortChange = {handlePortChange}
                    handlePortDelete = {handlePortDelete}
                    port={p}
                    ></NodePortEdit>
                    )}
                    </div>
                    </div>
                    <div className='popup-footer normal display'>
                    <button className='btn btn-primary' type='submit'>Done</button>
                    <button className='btn btn-cancel' type='button' onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    ): ""
}