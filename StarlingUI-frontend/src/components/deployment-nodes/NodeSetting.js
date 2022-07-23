import React, {useState, useEffect} from 'react'
import UploadAndDisplayImage from './UploadAndDisplayImage';

export default function NodeSetting(props) {

    const [name, setName] = useState(props.node.name);
    const [kind, setKind] = useState(props.node.kind);
    const [app, setApp] = useState(props.node.label.app);
    const [platform, setPlatform] = useState(props.node.label.platform);

    const [selectedImage, setSelectedImage] = useState(props.node.kind==='master'? props.masterPic: props.dronePic);

    const [warning, setWarning] = useState('');

    useEffect(()=>{
        if(props.trigger===true){
            setWarning('');
        }
    },[name, kind, app, platform, selectedImage]);

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

        if(kind==='master'){
            props.setMasterPic(selectedImage);
        }else{
            props.setDronePic(selectedImage);
        }
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
        <div className='popup-projects-inner advanced-setting'>
        <div className='popup-header'>
            <span className='popup-title'>Advanced Settings</span>
            <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
        </div>
            {warning!=='' && <div className="warning-msg wordwrap"><i className="fa fa-warning"></i>{warning}</div>}
            <form onSubmit={saveChange} className="advanced-setting-form">
                <div className="advanced-setting">
                <div className='popup-major'>
                <div><label 
                    htmlFor='name' className='popup-major-key major'>Name<span className='required'>*</span>
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
                </input></div>
                <div><label 
                    htmlFor='kind' className='popup-major-key major'>Kind<span className='required'>*</span>
                </label>
                <select className='dropdown-select' value={kind} onChange={e=>setKind(e.target.value)}>
                    <option value="master">master</option>
                    <option value="deployment">deployment</option>
                </select></div>
                </div>

                <div className='sub-title'><span>label</span></div>
                <div className='popup-secondary'>
                <label 
                    htmlFor='app' className='popup-major-key'>app
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
                    htmlFor='platform' className='popup-major-key'>platform
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
                </div>
                <UploadAndDisplayImage options={props.options} selectedImage={selectedImage} setSelectedImage={setSelectedImage}></UploadAndDisplayImage>
                </div>
                <div className='popup-footer normal display'>
                <button className='btn btn-primary' type="submit">Done</button>
                <button className='btn btn-cancel' type="button" onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
): ""
}
