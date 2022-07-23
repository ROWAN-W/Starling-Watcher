import React, {useContext, useState} from 'react';
import { ProjectContext } from '../App';
import logo from '../img/load.gif';

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
            console.log("unmatched new/confirmed password")
            setError("Unmatched password!");
            return;
        }
        setError(null);
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
            throw Error("Duplicate user name!");
          } 
          return res.json();
        })
        .then(data => {
          console.log("valid new account");
          console.log(data);
          setWaiting(false);
          setError(null);
          console.log("fetch "+url);
          setInstruction("Success!");
          
          setTimeout(() => {
            clearField();
            props.setTrigger(false);
            handleUserAdd(data.id,data.name);
          }, 2000)
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
                    <p></p>
                    <div className='popup-footer single'>
                    <button className='btn'>Sign up</button>
                    </div>
                    </form>
            </div>
        </div>
      ): ""
}
