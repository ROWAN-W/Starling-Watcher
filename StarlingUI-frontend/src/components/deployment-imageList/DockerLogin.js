import React, {useState} from 'react'

export default function DockerLogin(props) {


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("try to login dock hub");
        props.finalLogin(userName,password);
        clearField();
        props.setSwitchButton(true);
        props.setTrigger(false);
    }

    function clearField(){
        setUserName('');
        setPassword('');
    }

    return (props.trigger) ?(
        <div className='docker-expand'>
                <form onSubmit={handleSubmit}>
                    <label 
                        htmlFor='DockerUserName'>User Name or Email Address
                    </label>
                    <input 
                        type='text' 
                        name='DockerUserName' 
                        id='DockerUserName'
                        required
                        value={userName}
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
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <button type="submit" className='btn btn-menu'>Sign in</button>
                </form>
        </div>
      ): ""
}