import React, {useState, useContext} from 'react'
import { ProjectContext } from '../App';

export default function DockerLogin(props) {

    const {handleImageListChange} = useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    //0 is neutral, 1 is valid, -1 is invalid
    const [valid, setValid] = useState(0);

    function checkValid(){
        console.log(userName);
        console.log(password);

        const dockerAccount = props.dockerAccounts.find(element => element.userName===userName && element.password===password);

        if(dockerAccount===undefined){
            console.log("invalid login in");
            setValid(-1);
        }else{
            console.log("login dock hub");
            setValid(1);
            handleImageListChange(dockerAccount.images);
            //clear the account state
            setUserName('');
            setPassword('');
            props.setSwitchButton(true);
            props.setTrigger(false);
        }
    }

    function showInValid(){
        if(valid===-1){
            return(
                <h4>Invalid user name or password!</h4>
            );
        }
    }

  
    return (props.trigger) ?(
        <div className='docker-expand'>
                <h3>Docker Hub Sign in</h3>
                {showInValid()}
                    <label 
                        htmlFor='DockerUserName'>User Name or Email Address
                    </label>
                    <input 
                        type='text' 
                        name='DockerUserName' 
                        id='DockerUserName'
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
                        onChange={e=>setPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <button onClick={()=>{checkValid()}}>Sign in</button>
                    <button onClick={()=>{props.setTrigger(false);setValid(0);props.setShowButton(true); props.setSwitchButton(true)}}>Cancel</button>
        </div>
      ): ""
}