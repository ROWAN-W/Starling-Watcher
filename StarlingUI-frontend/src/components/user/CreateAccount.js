import React, {useContext, useState, useEffect} from 'react';
import axios from "axios";
import { ProjectContext } from '../App';
import logo from '../../css/img/load.gif';
import { useCookies } from "react-cookie";
const port = '8080';
const protocol = "http://";
const REGISTER_URL = protocol+window.location.hostname+':'+port+'/register';
const USER_URL = protocol+window.location.hostname+':'+port+'/design/users';

export default function CreateAccount(props) {

    const [cookies, setCookie] = useCookies(["refreshToken"]);
    
    const {userData, setUserData, handleCurrentUser, setRememberMe} = useContext(ProjectContext);

    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [createUserError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [instruction, setInstruction] = useState('');

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
        props.setTrigger(false);clearField()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newPassword!==newPasswordAgain){
            console.log("unmatched new/confirmed password")
            setError("Unmatched password!");
            return;
        }
        setError(null);
        setWaiting(true);

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name: newUserName, password: newPassword }),
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                    },
                }, 
            );
            //setWaiting(false);
            //setError(null);
            //setInstruction("Success!");
            const accessToken = response?.data.accessToken;
            const refreshToken = response?.data.refreshToken;
            axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
            setCookie("refreshToken", refreshToken, {path: '/'});
            console.log(accessToken);
            console.log(refreshToken);
            if(userData===null){
                axios.get(USER_URL).then(responses => {
                    const responseOne = responses.data;
                    setWaiting(false);
                    setError(null);
                    setInstruction("Success!");
                    setUserData(responseOne);
                    console.log("fetch: "+USER_URL);
                  }).catch(err => {
                    setWaiting(false);
                    if(err.response.status===401){
                      setError("Authentication is required. Please sign in again.");
                      handleCurrentUser(undefined);
                    }else{
                      setError(err.message);
                    }
                  })  
            }
            else{
                const newUser = {id: response.data.id, name: response.data.name};
                setUserData([...userData, newUser]);
            }
            setTimeout(() => {
                clearField();
                props.setTrigger(false);
                //handleUserAdd(response.data.id,response.data.name);
                handleCurrentUser(response.data.id);
            }, 800)
        } catch (err) {
            console.log(err.message);
            if(err.response.status===403){
                setError("Duplicate user name");
            }
            else{
                setError(err.message);
            }
            setWaiting(false);
        }
    }

    function clearField(){
        setNewUserName('');
        setNewPassword('');
        setNewPasswordAgain('');
        setError(null);
        setWaiting(false);
        setInstruction('');
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner user'>
            <div className='popup-header'>
                <span className='popup-title'>Create Account</span>
                <button type="button" className='popup-close-button' onClick={()=>{closeWindow()}}>&times;</button>
            </div>
                    <form onSubmit={handleSubmit} className="form">
                    <div className='key-hint advanced-setting'>(Press Enter to save content, ESC to leave)</div>
                    {createUserError && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{createUserError}</div>}
                    {/*waiting && <h4>Please wait...</h4>*/}
                    {waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                    {instruction!=='' && <div className="success-msg wordwrap"><i className="fa fa-check"></i>{instruction}</div>}
                    <p></p>
                    <label 
                        htmlFor='userName'>User Name (Max 10 characters)
                    </label>
                    <input 
                        type='text'
                        name='userName' 
                        id='userName'
                        required
                        maxLength="10"
                        onChange={e=>setNewUserName(e.target.value)}
                        ref={(button) => { textInput = button; }}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='password'>Password (No restriction)
                    </label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password'
                        required
                        onChange={e=>setNewPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='passwordAgain'>Confirmed Password
                    </label>
                    <input 
                        type='password' 
                        name='passwordAgain' 
                        id='passwordAgain'
                        required
                        onChange={e=>setNewPasswordAgain(e.target.value)}
                        >
                    </input>
                    <div className='rememberMe-option' title="Not recommended on public or shared computers"><input type="checkbox" className='rememberMe' onChange={()=>{setRememberMe(prev=>!prev)}} defaultChecked={true}/> <label htmlFor="rememberMe">Remember me</label></div>
                    <p></p>
                    <div className='popup-footer single'>
                    <button className='btn'>Sign up</button>
                    </div>
                    </form>
            </div>
        </div>
      ): ""
}
