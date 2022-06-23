import React, { useState } from 'react';
import axios from 'axios';

export default function Upload(props) {

    
    const [selectedFile, setSelectedFile] = useState();
    const [result, setResult] = useState('');
    const [deployable, setDeployable] = useState(false);

    function handleFileUpload(){
        if(selectedFile===null || selectedFile===undefined){
            setResult("Please choose valid file (.yml or .yaml)");
            return;
        }
        const fd = new FormData();
        fd.append('file',selectedFile);
        axios.post("http://localhost:8000/upload",fd)
        .then(res => {
            setResult('File uploaded successfully');
            console.log(res);
            setDeployable(true);
          })
          .catch(err => {
            setResult('File upload failed');
            console.log(err);
        })
    }

    function clearField(){
        setSelectedFile();
        setResult('');
        setDeployable(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setResult('Please wait...');
        setDeployable(false);
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
                <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                <h3>Upload file & Deploy</h3>
                <form method="post" action="#" id="#" onSubmit={handleSubmit}>
                    <div className="form-group files">
                        <input type="file" className="form-control" required onChange={e=>{setSelectedFile();checkMimeType(e)&&setSelectedFile(e.target.files[0]);}} onClick={()=>{setResult('');setDeployable(false);}}/>
                    </div>
                    <div>{result}</div> 
                    <div><button type='submit'>Upload</button>{deployable && <button type='button'>Deploy</button> }</div> 
                </form>
            </div>
        </div>
    ): ""
}