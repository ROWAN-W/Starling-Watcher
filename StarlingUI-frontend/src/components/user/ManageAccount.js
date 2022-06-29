import React, {useContext, useState} from 'react'
import { ProjectContext } from '../App';

export default function ManageAccount(props) {
    
    const {currentUserID} = useContext(ProjectContext);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [userChangeError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [instruction, setInstruction] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function clearField(){
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
        setError(null);
        setWaiting(false);
        setInstruction('');
    }

    function checkValid(){
        if(newPassword!==newPasswordAgain){
            console.log("unmatched password")
            setError("Unmatched password!");
            return;
        }

        setWaiting(true);
        const url = "http://localhost:8080/design/users";
        
        const options = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            oldPassword: oldPassword,
            password: newPassword,
        }),
        };
        
        fetch(url+'/'+currentUserID,options)
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error('Manage Account Failure. Error Details: '+res.status);
          } 
          return res.json();
        })
        .then(data => {
          console.log("valid change account");
          console.log(data);
          setWaiting(false);
          setError(null);
          console.log("fetch "+url);
          setInstruction("Success: The window will close automatically.");
          setTimeout(() => {
            clearField();
            props.setTrigger(false);
          }, 3000)
        })
        .catch(err => {
          // auto catches network / connection error
          setWaiting(false);
          setError(err.message);
        })        
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                <h3>Change Password</h3>
                {userChangeError && <h4>{userChangeError}</h4>}
                {waiting && <h4>Please wait...</h4>}
                <h4>{instruction}</h4>
                <form onSubmit={handleSubmit}>
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
                    <button type='submit'>Save Change</button>
                    <button type='button' onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                </form>
            </div>
        </div>
      ): ""
}