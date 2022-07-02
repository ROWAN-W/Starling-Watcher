import React,{useContext, useState} from 'react';
import { ProjectContext } from '../App';

export default function LoginIn(props) {

    const {handleCurrentUser} = useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [loginError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    //const [instruction, setInstruction] = useState('');
    const [forgot, setForgot] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function checkValid(){
        setError(null);
        setWaiting(true);
        const url = "http://localhost:8080/design/login";
        
        const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            name: userName,
            password: password,
        }),
        };
        
        fetch(url,options)
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error('Login Failure. Error Details: '+"Invalid username or password!");
          } 
          return res.json();
        })
        .then(data => {
          console.log("valid account");
          console.log(data);
          setWaiting(false);
          setError(null);
          console.log("fetch "+url);
          //setInstruction("Success!");
          
          //setTimeout(() => {
            handleCurrentUser(data.id);
            clearField();
            props.setTrigger(false);
          //}, 2000)
        })
        .catch(err => {
          // auto catches network / connection error
          setWaiting(false);
          setError(err.message);
        })        
    }

    function forgotPassword(){
        if(forgot){
            return <p>Forgot password? Please contact administrator.</p>
        }else{
            return <p>Forgot password?</p>
        }
    }

    function clearField(){
        setUserName('');
        setPassword('');
        setForgot(false);
        setError(null);
        setWaiting(false);
        //setInstruction('');
    }

    
  return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField();}}>&times;</button>
            <h3>Sign in</h3>
            {loginError && <h4>{loginError}</h4>}
            {waiting && <h4>Please wait...</h4>}
            <h4>{/*instruction*/}</h4>
            <p onClick={()=>{props.handleCreateNewAccount(true); props.setTrigger(false);clearField();}}>New user? Create an account</p>
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
