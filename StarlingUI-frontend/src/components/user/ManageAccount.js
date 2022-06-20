import React, {useContext, useState, useEffect} from 'react'
import { ProjectContext } from '../App';

export default function ManageAccount(props) {
    
    const {users, handleUserChange} = useContext(ProjectContext);
    /*const user = users.find(u=>u.name===currentUser);*/
    
    const [newUserName, setNewUserName] = useState(props.currentUser.name);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    //0 is neutral, 1 is valid, -1 is invalid, -2 is already exist, -3 is missing info, -4 incorrect password
    const [valid, setValid] = useState(0);

    useEffect(()=>{
        console.log("re-render account management");
      },[valid]);
    
    //pass in the object
    function handleChange(changes){
    //a brand new object
    handleUserChange(props.currentUser.id, {...props.currentUser,...changes});
    }

    function clearField(){
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
    }
    

    function checkValid(){
        if(newUserName===''){
            console.log("no user name")
            setValid(-3);
            return;
        }
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
        const result = users.find(element => element.name===newUserName);
        if(newUserName!==props.currentUser.name && result!==undefined){
            console.log("invalid user name")
            setValid(-2);
            return;
        }
        console.log("valid account management");
        setValid(1);
        if(props.currentUser.name!==newUserName || (newPassword!=''&&newPassword!==oldPassword)){
            props.setWarning(true);
            if(newPassword!==''){
                handleChange({name:newUserName, password: newPassword});
            }else{
                handleChange({name:newUserName});
            }
            props.setTrigger(false);
        }
    }

    function showInValid(){
        if(valid===-1){
            return(
                <h4>Please make sure your passwords match!</h4>
            );
        }
        if(valid===-2){
            return(
                <h4>User name already exists!</h4>
            );
        }
        if(valid===-3){
            return(
                <h4>User name is required!</h4>
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
                <h3>Manage Account</h3>
                {showInValid()}
                    <label 
                        htmlFor='userName'>Change User Name
                    </label>
                    <input 
                        type='text' 
                        name='userName' 
                        id='userName'
                        value={newUserName}
                        onChange={e=>setNewUserName(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='password'>Current Password
                    </label>
                    <input 
                        type='password' 
                        name='password' 
                        id='password'
                        value={oldPassword}
                        onChange={e=>setOldPassword(e.target.value)}
                        >
                    </input>
                    <p>Change Password?</p>
                    <label 
                        htmlFor='newpassword'>&nbsp;&nbsp;&nbsp;&nbsp;New Password
                    </label>
                    <input 
                        type='password' 
                        name='newpassword' 
                        id='newpassword'
                        value={newPassword}
                        onChange={e=>setNewPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='passwordAgain'>&nbsp;&nbsp;&nbsp;&nbsp;Confirmed New Password
                    </label>
                    <input 
                        type='password' 
                        name='passwordAgain' 
                        id='passwordAgain'
                        value={newPasswordAgain}
                        onChange={e=>setNewPasswordAgain(e.target.value)}
                        >
                    </input>
                    <p></p>
                    <button onClick={()=>{checkValid();props.setTrigger(false)}}>Save Change</button>
                    <button onClick={()=>{props.setTrigger(false);clearField();setValid(0)}}>Cancel</button>
            </div>
        </div>
      ): ""
}
