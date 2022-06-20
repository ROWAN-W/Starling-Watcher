import React, {useContext, useState, useEffect} from 'react';
import { ProjectContext } from '../App';

export default function CreateAccount(props) {

    const {users, handleUserAdd} = useContext(ProjectContext);

    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    //0 is neutral, 1 is valid, -1 is invalid, -2 is already exist, -3 is missing info
    const [valid, setValid] = useState(0);

    useEffect(()=>{
        console.log("re-render create account");
      },[valid]);
    
    function checkValid(){
        if(newUserName===''||newPassword===''){
            console.log("no user name / password")
            setValid(-3);
            return;
        }
        if(newPassword!==newPasswordAgain){
            console.log("unmatched password")
            setValid(-1);
            return;
        }
        const result = users.find(element => element.name===newUserName);
        if(result!==undefined){
            console.log("invalid user name")
            setValid(-2);
            return;
        }
        handleUserAdd(newUserName,newPassword);
        console.log("valid new account");
        setValid(1);
        clearField();
        props.setTrigger(false)
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
                <h4>User name and password is required!</h4>
            );
        }
    }

    function clearField(){
        setNewUserName('');
        setNewPassword('');
        setNewPasswordAgain('');
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setValid(0);clearField()}}>&times;</button>
                <h3>Create Account</h3>
                {showInValid()}
                    <label 
                        htmlFor='userName'>User Name
                    </label>
                    <input 
                        type='text'
                        name='userName' 
                        id='userName'
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
                        onChange={e=>setNewPasswordAgain(e.target.value)}
                        >
                    </input>
                    <p></p>
                    <button onClick={()=>{checkValid()}}>Sign up</button>
            </div>
        </div>
      ): ""
}
