import React, { useState, useContext } from 'react';
import logo from '../img/load.gif';
import axios from 'axios';
import { ProjectContext } from '../App';
const UPLOAD_URL = 'http://localhost:8080/design/upload';

export default function Upload(props) {

    const [namespace, setNamespace] = useState('');
    const {handleCurrentUser} = useContext(ProjectContext);

    const [selectedFile, setSelectedFile] = useState();
    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);
    const [reLogin, setReLogin] = useState(false);

    function handleFileUpload(){
        if(selectedFile===null || selectedFile===undefined){
            setResult("Please choose valid file (.yml or .yaml)");
            return;
        }
        const fd = new FormData();
        fd.append('namespace',namespace);
        fd.append('file',selectedFile);
        axios.post(UPLOAD_URL,fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
        })
        .then(res => { 
            setIsPending(false);
            setResult('Success'); //respond from Rowan's server
          })
        .catch(err => {
            setIsPending(false);
            if(err.response.status===404){
                setResult("Invalid YAML file/ Fail to deploy");
            }
            else if(err.response.status===401){
                setResult("Authentication is required. Please sign in again.");
                setReLogin(true);
            }
            else{
                setResult(err.message);
            }
        })
    }

    function clearField(){
        setSelectedFile();
        setResult('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(namespaceCheck(namespace)){
            setIsPending(true);
            setResult('Please wait...');
            handleFileUpload();
        }
    }


    const checkMimeType=(event)=>{
        let file = event.target.files[0]; 
        if(file===null || file===undefined){
            return false;
        }        
        console.log("checking");
        let str = file.name;
        console.log(file);
        console.log(file.name);

        const index = str.lastIndexOf('.');
        const after = str.slice(index + 1);
        console.log(after); 
        if(after!=='yml' && after!=='yaml'){
            setResult("YAML file Only.");
            return false;
        }else{
            return true;
        }
    }

    function namespaceCheck(value){
        if(value!==''){
            for (let i = 0; i < value.length; i++) {
            let code = value.charCodeAt(i);
            if ((code !== 45) && // '-'
                !(code > 47 && code < 58) && // numeric (0-9)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                
                console.log("contain only lowercase alphanumeric characters or '-'");
                setResult("Namespace can only contain '-' or lowercase alphanumeric characters")
                return false;
                }
            }
            if(value.charCodeAt(0)===45 || value.charCodeAt(value.length-1)===45){
                console.log("start/end with an alphanumeric character");
                setResult("Namespace can only start/end with an alphanumeric character")
                return false;
            }
        }
        return true;
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
                <span className='popup-title'>Upload file (YAML/YML) & Deploy</span>
                {!savePending && <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField();authenticateAgain()}}>&times;</button>}
            </div>
                <form method="post" action="#" id="#" onSubmit={handleSubmit} className="advanced-setting-form">
                    {savePending && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                    {!savePending && result!=='' && result!=='Success' && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{result}</div>}
                    {result==='Success' && <div className="success-msg wordwrap"><i className="fa fa-check"></i>{result}</div>}
                    <div className='popup-major stack'>
                    <label 
                        htmlFor='namespace' className='popup-major-key major'>Namespace<span className='required'>*</span>
                    </label>
                    <input 
                        type='text' 
                        name='namespace' 
                        id='namespace'
                        value={namespace}
                        required
                        maxLength = {63}
                        onChange={e=>setNamespace(e.target.value)}
                        className="width-100"
                        >
                    </input>
                    </div>
                    <div className='popup-major stack'>                    
                    <label 
                        htmlFor='file' className='popup-major-key major'>YAML/YML<span className='required'>*</span>
                    </label>
                    <input type="file" required 
                        onClick={()=>{setResult('');setSelectedFile()}} onChange={e=>{checkMimeType(e)&&setSelectedFile(e.target.files[0])}} className="width-100"/>
                    </div>
                    <br></br>
                    <div className='popup-footer single'>
                        {selectedFile && <button className='btn' type='submit'>Deploy</button>}
                    </div> 
                </form>
            </div>
        </div>
    ): ""
}