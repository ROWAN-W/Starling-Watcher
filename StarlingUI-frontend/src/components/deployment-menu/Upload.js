import React, { useState } from 'react';
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
        axios.post("http://localhost:8000/upload",fd)
        .then(res => { 
            if (!res.ok) { // error coming back from server
                setIsPending(false);
                setResult('Error Details: '+res.status);   
                throw Error('Error Details: '+res.status);
            } 
            return res.json();
          })
        .then(data => {
            setIsPending(false);
            setResult('File uploaded successfully'); //respond from Rowan's server
            //setResult(data); 
        })
          .catch(err => {
            setIsPending(false);
            // auto catches network / connection error
            setResult("Failed to connect to the server");
            console.log(err);
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
                {!savePending && <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>}
                <h3>Upload file & Deploy</h3>
                <form method="post" action="#" id="#" onSubmit={handleSubmit}>
                    <div className="form-group files">
                        <input type="file" className="form-control" required onChange={e=>{setSelectedFile();checkMimeType(e)&&setSelectedFile(e.target.files[0]);}} onClick={()=>{setResult('');}}/>
                    </div>
                    <div>{result}</div> 
                    <div><button type='submit'>Deploy</button></div> 
                </form>
            </div>
        </div>
    ): ""
}