import React, {useState} from 'react'
import NodeEnvEdit from './NodeEnvEdit';
import { v4 as uuidv4 } from 'uuid';
import NodePortEdit from './NodePortEdit';

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
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                <h3>Advanced Settings</h3>
                <form onSubmit={saveChange}>
                    <label 
                        htmlFor='command'>command
                    </label>
                    <input 
                        type='text' 
                        name='command' 
                        id='command'
                        value={command}
                        onChange={e=>setCommand(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='command'>args
                    </label>
                    <input 
                        type='text' 
                        name='args' 
                        id='args'
                        value={args}
                        onChange={e=>setArgs(e.target.value)}
                        >
                    </input>
                    <p></p>
                    <label>Env:</label>
                    <div className='popup-pair-grid'>
                    <div>Name</div>
                    <div>Value</div>
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
                    <div>
                        <button onClick={()=>handleEnvAdd()}>Add Env</button>
                    </div>
                    <p></p>
                    <label>Port:</label>
                    <div className='popup-pair-grid'>
                    <div>Port Number</div>
                    <div>Protocol</div>
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
                    <div>
                        <button onClick={()=>handlePortAdd()}>Add Port</button>
                    </div>
                    <br/>
                    <button type='submit'>Save Change</button>
                    <button type='button' onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                </form>
            </div>
        </div>
    ): ""
}