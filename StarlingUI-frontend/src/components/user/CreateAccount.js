import React, {useContext, useState} from 'react';
import axios from "axios";
import { ProjectContext } from '../App';
import logo from '../img/load.gif';
import { useCookies } from "react-cookie";
const REGISTER_URL = 'http://localhost:8080/register';

export default function CreateAccount(props) {

    const [cookies, setCookie] = useCookies(["refreshToken"]);
    
    const {handleUserAdd, setRememberMe} = useContext(ProjectContext);

    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [createUserError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [instruction, setInstruction] = useState('');

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
            setWaiting(false);
            setError(null);
            setInstruction("Success!");
            const accessToken = response?.data.accessToken;
            const refreshToken = response?.data.refreshToken;
            axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
            setCookie("refreshToken", refreshToken, {path: '/'});
            console.log(accessToken);
            console.log(refreshToken);
            setTimeout(() => {
                clearField();
                props.setTrigger(false);
                handleUserAdd(response.data.id,response.data.name);
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
                <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
            </div>
                    <form onSubmit={handleSubmit} className="form">
                    {createUserError && <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{createUserError}</div>}
                    {/*waiting && <h4>Please wait...</h4>*/}
                    {waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                    {instruction!=='' && <div className="success-msg wordwrap"><i className="fa fa-check"></i>{instruction}</div>}
                    <p></p>
                    <label 
                        htmlFor='userName'>User Name
                    </label>
                    <input 
                        type='text'
                        name='userName' 
                        id='userName'
                        required
                        onChange={e=>setNewUserName(e.target.value)}
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
