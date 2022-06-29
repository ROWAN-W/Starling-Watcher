import React,{useContext, useState} from 'react';
import { ProjectContext } from '../App';

export default function LoginIn(props) {

    const {userData, handleCurrentUser} = useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    //0 is neutral, 1 is valid, -1 is invalid
    const [valid, setValid] = useState(0);
    const [forgot, setForgot] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function checkValid(){
        const result = userData.find(element => element.name===userName && element.password===password);
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

    function forgotPassword(){
        if(forgot){
            return <p>Forgot password? Please contact administrator.</p>
        }else{
            return <p>Forgot password?</p>
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
        setForgot(false);
    }

    
  return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setValid(0);clearField();}}>&times;</button>
            <h3>Sign in</h3>
            {showInValid()}
            <p onClick={()=>{props.handleCreateNewAccount(true); props.setTrigger(false);setValid(0);clearField();}}>New user? Create an account</p>
                <form onSubmit={handleSubmit}>
                <label 
                    htmlFor='userName'>User Name
                </label>
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    required
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
                    required
                    onChange={e=>setPassword(e.target.value)}
                    >
                </input>
                <div onClick={()=>setForgot(prev=>!prev)}>{forgotPassword()}</div>
                <button type='submit'>Sign in</button>
                </form>
        </div>
    </div>
  ): ""
}
