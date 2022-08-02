import React,{useContext, useState} from 'react';
import { ProjectContext } from '../App';
import logo from '../img/load.gif';

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
            throw Error("Invalid username or password!");
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
            return <p className='forgot'>Please contact administrator.</p>
        }else{
            return <p className='forgot'>Forgot password?</p>
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
        <div className='popup-projects-inner user'>
        <div className='popup-header'>
            <span className='popup-title'>Sign in</span>
            <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField();}}>&times;</button>
        </div>
                <form onSubmit={handleSubmit} className="form">
                {loginError && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{loginError}</div>}
                {/*waiting && <h4>Please wait...</h4>*/}
                {waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                <p className='link' onClick={()=>{props.handleCreateNewAccount(true); props.setTrigger(false);clearField();}}>New user? Create an account</p>
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
                <div className='popup-footer single'>
                    <div className='link' onClick={()=>setForgot(prev=>!prev)}>{forgotPassword()}</div>
                    <button className='btn' type='submit'>Sign in</button>
                </div>
                </form>
        </div>
    </div>
  ): ""
}
