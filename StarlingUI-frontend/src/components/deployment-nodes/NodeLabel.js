import React, {useState} from 'react'

export default function NodeLabel(props) {

    const [name, setName] = useState(props.node.name);
    const [app, setApp] = useState(props.node.label.app);
    const [platform, setPlatform] = useState(props.node.label.platform);

    function clearField(){
        setName(props.node.name);
        setApp(props.node.label.app);
        setPlatform(props.node.label.platform);
    }

    function handleChange(changes){
        props.handleNodeChange(props.node.id, {...props.node, ...changes})
    }

    /*function saveChange(){
        handleChange({name:name, label: {app: app, platform: platform} });
        props.setTrigger(false);
    }*/

    const saveChange = (e) => {
        e.preventDefault();
        handleChange({name:name, label: {app: app, platform: platform} });
        props.setTrigger(false);
    }



return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
            <h3>Advanced Settings</h3>
            <form onSubmit={saveChange}>
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
                <button type="submit">Save Change</button>
                <button type="button" onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
            </form>
        </div>
    </div>
): ""
}
