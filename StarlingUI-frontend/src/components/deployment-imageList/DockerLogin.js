import React, {useState} from 'react'

export default function DockerLogin(props) {


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    //const [waiting, setWaiting] = useState(false);

    function checkValid(){
        console.log("try to login dock hub");
        //props.setWaiting(true);
        props.finalLogin(userName,password);
        clearField();
        props.setWaiting(true);
        setTimeout(() => {
            props.setSwitchButton(true);
            props.setTrigger(false);
            console.log("waiting");
            props.setWaiting(false);
        }, "2500")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function clearField(){
        //props.setError(false);
        setUserName('');
        setPassword('');
    }

    return (props.trigger) ?(
        <div className='docker-expand'>
                <h3>Docker Hub Sign in</h3>
                <form onSubmit={handleSubmit}>
                    <label 
                        htmlFor='DockerUserName'>User Name or Email Address
                    </label>
                    <input 
                        type='text' 
                        name='DockerUserName' 
                        id='DockerUserName'
                        required
                        onChange={e=>setUserName(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='DockerPassword'>Password
                    </label>
                    <input 
                        type='password' 
                        name='DockerPassword' 
                        id='DockerPassword'
                        required
                        onChange={e=>setPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <button type="submit">Sign in</button>
                    {props.waiting && <div>Please wait...</div>}
                </form>
        </div>
      ): ""
}