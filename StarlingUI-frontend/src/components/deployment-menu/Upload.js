import React, { useState } from 'react';
import logo from '../img/load.gif';
import axios from 'axios';

export default function Upload(props) {

    
    const [selectedFile, setSelectedFile] = useState();
    const [result, setResult] = useState('');
    const [savePending, setIsPending] = useState(false);

    function handleFileUpload(){
        if(selectedFile===null || selectedFile===undefined){
            setResult("Please choose valid file (.yml or .yaml)");
            return;
        }
        const fd = new FormData();
        fd.append('file',selectedFile);
        axios.post("http://localhost:8080/design/upload",fd, {
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
            setResult(err.message);
        })
    }

    function clearField(){
        setSelectedFile();
        setResult('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true);
        setResult('Please wait...');
        handleFileUpload();
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
            setResult("Can only upload YAML file");
            return false;
        }else{
            return true;
        }
    }

    return (props.trigger) ? (
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <div className='popup-header'>
                <span className='popup-title'>Upload file (YAML/YML) & Deploy</span>
                {!savePending && <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>}
            </div>
                <form method="post" action="#" id="#" onSubmit={handleSubmit} className="form">
                    {savePending && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                    {!savePending && result!=='' && result!=='Success' && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{result}</div>}
                    {result==='Success' && <div className="success-msg wordwrap"><i className="fa fa-check"></i>{result}</div>}
                    
                    <div className="files">
                        <input type="file" required 
                        onClick={()=>{setResult('');setSelectedFile()}} onChange={e=>{checkMimeType(e)&&setSelectedFile(e.target.files[0])}}/>
                    </div>
                    <div className='popup-footer single'>
                        {selectedFile && <button className='btn' type='submit'>Deploy</button>}
                    </div> 
                </form>
            </div>
        </div>
    ): ""
}