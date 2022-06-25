import React, {useContext, useState} from 'react'
import { ProjectContext } from '../App';

export default function ManageAccount(props) {
    
    const {handleUserChange} = useContext(ProjectContext);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    //0 is neutral, 1 is valid, -1 is invalid, -4 incorrect password
    const [valid, setValid] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }

    function handleChange(changes){
        handleUserChange(props.currentUser.id, {...props.currentUser,...changes});
    }

    function clearField(){
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
    }
    

    function checkValid(){
        if(oldPassword!==props.currentUser.password){
            console.log("incorrect password")
            setValid(-4);
            return;
        }
        if(newPassword!==newPasswordAgain){
            console.log("unmatched password")
            setValid(-1);
            return;
        }
        console.log("valid account management");
        handleChange({password: newPassword});
        setValid(1);
        props.setTrigger(false)
    }

    function showInValid(){
        if(valid===-1){
            return(
                <h4>New password and confirmed password don't match!</h4>
            );
        }
        if(valid===-4){
            return(
                <h4>Current password is incorrect!</h4>
            );
        }
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setValid(0);clearField()}}>&times;</button>
                <h3>Change Password</h3>
                {showInValid()}
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
                    <button type='button' onClick={()=>{props.setTrigger(false);clearField();setValid(0)}}>Cancel</button>
                </form>
            </div>
        </div>
      ): ""
}