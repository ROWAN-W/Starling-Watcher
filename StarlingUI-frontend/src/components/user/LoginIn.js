import React,{useContext, useEffect, useState} from 'react';
import { ProjectContext } from '../App';

export default function LoginIn(props) {

    const {users, handleCurrentUser} = useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    //0 is neutral, 1 is valid, -1 is invalid
    const [valid, setValid] = useState(0);

    useEffect(()=>{
        console.log("re-render login");
      },[valid]);

    function checkValid(){
        console.log(userName);
        console.log(password);

        const result = users.find(element => element.name===userName && element.password===password);

        if(result===undefined){
            setValid(-1);
        }else{
            handleCurrentUser(result.name);
            setValid(1);
            console.log(result.name);
            clearField();
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

    function clearField(){
        setUserName('');
        setPassword('');
    }

    
  return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setValid(0);clearField();}}>&times;</button>
            <h3>Sign in</h3>
            {showInValid()}
            <p onClick={()=>{props.handleCreateNewAccount(true); props.setTrigger(false);setValid(0);clearField();}}>New user? Create an account</p>
                <label 
                    htmlFor='userName'>User Name
                </label>
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    onChange={e=>setUserName(e.target.value)}
                    >
                </input>
                <br></br>
                <label 
                    htmlFor='password'>Password
                </label>
                <input 
                    type='password' 
                    name='password' 
                    id='password'
                    onChange={e=>setPassword(e.target.value)}
                    >
                </input>
                <p>Forgot Password?</p>
                <button onClick={()=>{checkValid()}}>Sign in</button>
        </div>
    </div>
  ): ""
}
