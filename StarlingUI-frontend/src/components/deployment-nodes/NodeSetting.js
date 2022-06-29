import React, {useState} from 'react'

export default function NodeSetting(props) {

    const [name, setName] = useState(props.node.name);
    const [kind, setKind] = useState(props.node.kind);
    const [app, setApp] = useState(props.node.label.app);
    const [platform, setPlatform] = useState(props.node.label.platform);

    const [warning, setWarning] = useState('');

    function clearField(){
        setName(props.node.name);
        setKind(props.node.kind);
        setApp(props.node.label.app);
        setPlatform(props.node.label.platform);
        setWarning('');
    }

    function handleChange(changes){
        props.handleNodeChange(props.node.id, {...props.node, ...changes})
    }

    const saveChange = (e) => {
        e.preventDefault();
        if(kind==='master'){
            console.log('need checking');
            for(let i=0;i<props.nodes.length;i++){
                if(props.nodes[i].kind==='master'){
                    //more than one master
                    console.log("invalid")
                    setWarning('One Master at most in the project');
                    return;
                }
            }
        }
        console.log("valid")
        setWarning('');
        handleChange({name:name, kind:kind, label: {app: app, platform: platform} });
        props.setTrigger(false);
    }



return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
            <h3>Advanced Settings</h3>
            <h4>{warning}</h4>
            <form onSubmit={saveChange}>
                <div className='popup-major'>
                <label 
                    htmlFor='name'>Name
                </label>
                <input 
                    type='text' 
                    name='name' 
                    id='name'
                    value={name}
                    required
                    onChange={e=>setName(e.target.value)}
                    >
                </input>
                <label 
                    htmlFor='kind'>Kind
                </label>
                <select value={kind} onChange={e=>setKind(e.target.value)}>
                    <option value="master">master</option>
                    <option value="deployment">deployment</option>
                </select>
                </div>
                <p></p>
                <span>label:</span>
                <label 
                    htmlFor='app'>app
                </label>
                <input 
                    type='text' 
                    name='app' 
                    id='app'
                    value={app}
                    required
                    onChange={e=>setApp(e.target.value)}
                    >
                </input>
                <label 
                    htmlFor='platform'>platform
                </label>
                <input 
                    type='text' 
                    name='platform' 
                    id='platform'
                    value={platform}
                    required
                    onChange={e=>setPlatform(e.target.value)}
                    >
                </input>
                <br></br>
                <button type="submit">Done</button>
                <button type="button" onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
            </form>
        </div>
    </div>
): ""
}
