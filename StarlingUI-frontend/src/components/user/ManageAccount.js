import React, {useContext, useState,useEffect} from 'react';
import axios from "axios";
import { ProjectContext } from '../App';
import logo from '../../css/img/load.gif';
const port = '8080';
const protocol = "http://";
const USER_URL = protocol+window.location.hostname+':'+port+'/design/users';

export default function ManageAccount(props) {
    
    const {currentUserID,handleCurrentUser} = useContext(ProjectContext);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [userChangeError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [instruction, setInstruction] = useState('');

    const [reLogin, setReLogin] = useState(false);

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
        authenticateAgain();clearField();props.setTrigger(false);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newPassword!==newPasswordAgain){
            console.log("unmatched new/confirmed password")
            setError("Unmatched new/confirmed password!");
            return;
        }
        setError(null);
        setWaiting(true);


        try {
            const {data} = await axios.put(USER_URL+'/'+currentUserID,
                JSON.stringify({oldPassword: oldPassword,password: newPassword}),
                {
                    headers: { 
                        'Content-Type': 'application/json' ,
                    },
                }, 
            );
            setWaiting(false);
            setError(null);
            setInstruction("Success!");
            console.log("valid change account");
            console.log(data);
            setTimeout(() => {
                clearField();
                props.setTrigger(false);
            }, 800)
            } catch (err) {
                console.log(err.response);
                console.log(err.response.status);
                setWaiting(false);
                if(err.response.status===401){
                    setError("Authentication is required. Please sign in again.");
                    setReLogin(true);
                }
                else if(err.response.status===403){
                    if(err.response.data.errorMsg==='Invalid old password!'){
                        setError("Invalid current password");
                    }
                    else if(err.response.data.errorMsg==='User does not exist!'){
                        setError("User account doesn't exist. Please sign in with another account or create a new account.");
                        setReLogin(true);
                    }
                }
                else{
                    setError(err.message);
                }
            }
    }

    function clearField(){
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
        setError(null);
        setWaiting(false);
        setInstruction('');
    }

    function authenticateAgain(){
        if(reLogin){
          handleCurrentUser(undefined);
          setReLogin(false);
        }
      }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner user'>
            <div className='popup-header'>
                <span className='popup-title'>Change Password</span>
                <button type="button" className='popup-close-button' onClick={()=>{closeWindow()}}>&times;</button>
            </div>
                <form onSubmit={handleSubmit} className="form">
                <div className='key-hint advanced-setting'>(Press Enter to save content, ESC to leave)</div>
                {userChangeError && 
                <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{userChangeError}</div>}
                {/*waiting && <h4>Please wait...</h4>*/}
                {waiting && <h4 className='wait-message'><img className="loading" src={logo} alt="loading..." />Please wait...</h4>}
                {instruction!=='' && <div className="success-msg wordwrap"><i className="fa fa-check"></i>{instruction}</div>}
                <p></p>
                    <label 
                        htmlFor='password'>Current Password
                    </label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password'
                        value={oldPassword}
                        required
                        onChange={e=>setOldPassword(e.target.value)}
                        ref={(button) => { textInput = button; }}
                        >
                    </input>
                    <label 
                        htmlFor='newpassword'>New Password
                    </label>
                    <input 
                        type='password' 
                        name='newpassword' 
                        id='newpassword'
                        value={newPassword}
                        required
                        onChange={e=>setNewPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='passwordAgain'>Confirmed New Password
                    </label>
                    <input 
                        type='password' 
                        name='passwordAgain' 
                        id='passwordAgain'
                        value={newPasswordAgain}
                        required
                        onChange={e=>setNewPasswordAgain(e.target.value)}
                        >
                    </input>
                    <p></p>
                    <div className='popup-footer normal'>
                    <button className='btn btn-primary' type='submit'>Save Change</button>
                    <button className='btn btn-cancel' type='button' onClick={()=>{closeWindow()}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      ): ""
}