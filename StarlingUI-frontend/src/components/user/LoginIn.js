import React,{useContext, useState,useEffect} from 'react';
import axios from "axios";
import { ProjectContext } from '../App';
import logo from '../img/load.gif';
import { useCookies } from "react-cookie";
const LOGIN_URL = 'http://localhost:8080/login';

export default function LoginIn(props) {

    const [cookies, setCookie] = useCookies(["refreshToken"]);

    const {userData, handleCurrentUser,setRememberMe} =useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [loginError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [forgot, setForgot] = useState(false);

    useEffect(()=>{
        //key friendly
        window.addEventListener('keydown', keyOperation);
            
        return () => { 
          window.removeEventListener('keydown', keyOperation);
        };
      },[]);

    let textInput = null;
    useEffect(()=>{
        if(props.trigger===true){
            textInput.focus();
        }
    },[props.trigger])
    
    function keyOperation(e){
        if(e.key==='Escape'||e.code==='Escape'){
            closeWindow();
        }
    }

    function closeWindow(){
        props.setTrigger(false);clearField();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setWaiting(true);

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ name: userName, password: password }),
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                    },
                }, 
            );
            const accessToken = response?.data.accessToken;
            const refreshToken = response?.data.refreshToken;
            axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`};
            setCookie("refreshToken", refreshToken, {path: '/'});
            console.log(accessToken);
            console.log(refreshToken);
                handleCurrentUser(response.data.id);
                setWaiting(false);
                setError(null);
                clearField();
                props.setTrigger(false);
        } catch (err) {
            console.log(err.message);
            setWaiting(false);
            if(err.response.status===401){
                setError("Invalid username or password");
            }
            else{
                setError(err.message);
            }
        }
    }

    function forgotPassword(){
        if(forgot){
            return <div className='forgot-container'><p onClick={()=>setForgot(prev=>!prev)} className='forgot'>Please contact administrator</p></div>
        }else{
            return <div className='forgot-container'><p onClick={()=>setForgot(prev=>!prev)} className='forgot'>Forgot password?</p></div>
        }
    }

    function clearField(){
        setUserName('');
        setPassword('');
        setForgot(false);
        setError(null);
        setWaiting(false);
    }

    
  return (props.trigger) ?(
    <div className='popup-projects'>
        <div className='popup-projects-inner user'>
        <div className='popup-header'>
            <span className='popup-title'>Sign in</span>
            {userData && <button type="button" className='popup-close-button' onClick={()=>{closeWindow()}}>&times;</button>}
        </div>
                <form onSubmit={handleSubmit} className="form">
                <div className='key-hint advanced-setting'>(Press Enter to submit{userData? ", ESC to leave": ""})</div>
                {loginError && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{loginError}</div>}
                {waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                <div className='create-user-container'><p className='create-user' onClick={()=>{props.handleCreateNewAccount(true); props.setTrigger(false);clearField();}}>New user? Create an account</p></div>
                <label 
                    htmlFor='userName'>User Name
                </label>
                <input 
                    type='text' 
                    name='userName' 
                    id='userName'
                    required
                    onChange={e=>setUserName(e.target.value)}
                    ref={(button) => { textInput = button; }}
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
                {forgotPassword()}
                <div className='rememberMe-option' title="Not recommended on public or shared computers"><input type="checkbox" className='rememberMe' onChange={()=>{setRememberMe(prev=>!prev)}} defaultChecked={true}/> <label htmlFor="rememberMe">Remember me</label></div>
                <p></p>
                <div className='popup-footer single'>
                    <button className='btn' type='submit'>Sign in</button>
                </div>
                </form>
        </div>
    </div>
  ): ""
}
