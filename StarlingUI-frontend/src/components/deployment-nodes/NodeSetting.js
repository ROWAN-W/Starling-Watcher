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

    /**
    * contain at most 63 characters
    * contain only lowercase alphanumeric characters or '-'
    * start with an alphanumeric character
    * end with an alphanumeric character
     */

    const saveChange = (e) => {
        e.preventDefault();
        if(kind==='master'){
            console.log('need checking');
            for(let i=0;i<props.nodes.length;i++){
                if(props.nodes[i].kind==='master' && props.nodes[i].id!==props.node.id){
                    //more than one master
                    console.log("invalid")
                    setWarning('One Master at most in the project');
                    return;
                }
            }
        }

        for (let i = 0; i < name.length; i++) {
            let code = name.charCodeAt(i);
            if ((code !== 45) && // '-'
                !(code > 47 && code < 58) && // numeric (0-9)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                
                console.log("contain only lowercase alphanumeric characters or '-'!");
                setWarning("Name can only contain lowercase alphanumeric characters or '-'")
                return;
            }
        }
        if(name.charCodeAt(0)===45 || name.charCodeAt(name.length-1)===45){
            console.log("start/end with an alphanumeric character");
            setWarning("Name can only start/end with an alphanumeric character")
            return;
        }

        if(!labelCheck(app) || !labelCheck(platform)){
            return false;
        }
        console.log("valid")
        setWarning('');
        handleChange({name:name, kind:kind, label: {app: app, platform: platform} });
        props.setTrigger(false);
    }
    
    /**
    * must be 63 characters or less (can be empty),
    * unless empty, must begin and end with an alphanumeric character ([a-z0-9A-Z]),
    * could contain dashes (-), underscores (_), dots (.), and alphanumerics between.  (e.g. "starling.test-_test”, “pixhawk--test..__test”. they are all valid)
     */

    function labelCheck(value){
        if(value!==''){
            for (let i = 0; i < value.length; i++) {
            let code = value.charCodeAt(i);
            if ((code !== 45) && (code !== 95) && (code !== 46) && // '-' '_' '.'
                !(code > 47 && code < 58) && // numeric (0-9)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                
                console.log("contain only lowercase alphanumeric characters or '-' or more!");
                setWarning("Value can only contain lowercase alphanumeric characters or '-', '_' and '.'")
                return false;
                }
            }
            if(value.charCodeAt(0)===45 || value.charCodeAt(value.length-1)===45 ||
            value.charCodeAt(0)===95 || value.charCodeAt(value.length-1)===95 ||
            value.charCodeAt(0)===46 || value.charCodeAt(value.length-1)===46){
                console.log("start/end with an alphanumeric character");
                setWarning("Value can only start/end with an alphanumeric character")
                return false;
            }
        }
        return true;
     
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
                    maxLength = {63}
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
                    maxLength = {63}
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
                    maxLength = {63}
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
