import React, {useState} from 'react'

export default function DockerLogin(props) {


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function checkValid(){
        console.log("try to login dock hub");
        props.finalLogin(userName,password);
        clearField();
        props.setSwitchButton(true);
        props.setTrigger(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function clearField(){
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
                </form>
        </div>
      ): ""
}