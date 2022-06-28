import React, {useContext, useState} from 'react';
import { ProjectContext } from '../App';

export default function CreateAccount(props) {

    const {users, handleUserAdd} = useContext(ProjectContext);

    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    //0 is neutral, 1 is valid, -1 is invalid, -2 is already exist
    const [valid, setValid] = useState(0);

    //const [instruction, setInstruction] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
    }
    
    function checkValid(){
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
        /*console.log("valid new account");
        setValid(1);
        //temporary solution
        setInstruction("Success:");  
        setTimeout(() => {
            handleUserAdd(newUserName,newPassword);
            props.setTrigger(false);
            clearField();
        }, 2500);*/
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
    }

    function clearField(){
        setNewUserName('');
        setNewPassword('');
        setNewPasswordAgain('');
        //setInstruction('');
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);setValid(0);clearField()}}>&times;</button>
                <h3>Create Account</h3>
                {showInValid()}
                    <form onSubmit={handleSubmit}>
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
                    <p></p>
                    <button>Sign up</button>
                    </form>
            </div>
        </div>
      ): ""
}

//{instruction!=='' && <h4>Success: Manual sign in or refresh if the page isn't redirecting.</h4>}
