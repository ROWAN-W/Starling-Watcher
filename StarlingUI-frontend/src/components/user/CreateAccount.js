import React, {useContext, useState} from 'react';
import { ProjectContext } from '../App';

export default function CreateAccount(props) {

    const {handleUserAdd} = useContext(ProjectContext);

    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [createUserError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const [instruction, setInstruction] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        checkValid();
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
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            name: newUserName,
            password: newPassword,
        }),
        };
        
        fetch(url,options)
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error('Create Account Failure. Error Details: '+res.status);
          } 
          return res.json();
        })
        .then(data => {
          console.log("valid new account");
          console.log(data);
          setWaiting(false);
          setError(null);
          console.log("fetch "+url);
          setInstruction("Success: Manual sign in or refresh if the page isn't redirecting.");
          
          setTimeout(() => {
            handleUserAdd(data.id,data.name);
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
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                <h3>Create Account</h3>
                {createUserError && <h4>{createUserError}</h4>}
                {waiting && <h4>Please wait...</h4>}
                <h4>{instruction}</h4>
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
