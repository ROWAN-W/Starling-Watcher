import React, {useState,useEffect} from 'react'

export default function DockerLogin(props) {


    const [repoName, setRepoName] = useState('');

    let textInput = null;
    useEffect(()=>{
        if(props.trigger===true){
            textInput.focus();
        }
    },[props.trigger])

    const handleSubmit = (e) => {
        e.preventDefault();
        props.setError(null);
        props.setWaiting(true);
        props.setFinalRepoName(repoName);
        
        setRepoName('');
        props.setTrigger(false);
    }

    return (props.trigger) ?(
        <div className='docker-expand'>
                <form onSubmit={handleSubmit}>
                    <label 
                        htmlFor='DockerRepoName'>Public Repository Name
                    </label>
                    <input 
                        type='text' 
                        name='DockerRepoName' 
                        id='DockerRepoName'
                        placeholder='example: uobflightlabstarling'
                        required
                        value={repoName}
                        onChange={e=>setRepoName(e.target.value)}
                        style={{fontSize: ".9rem"}}
                        ref={(button) => { textInput = button; }}
                        >
                    </input>
                    <div className='key-hint docker-hint'>default repo: uobflightlabstarling</div>
                    <br></br>
                    <button type="submit" className='btn btn-menu btn-small'>Connect</button>
                    <button type="button" className='btn btn-menu btn-small' onClick={()=>{setRepoName('');props.setTrigger(false);}}>Cancel</button>
                </form>
        </div>
      ): ""
}