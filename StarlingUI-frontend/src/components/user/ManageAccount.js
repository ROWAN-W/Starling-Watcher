import React, {useContext, useState} from 'react'
import { ProjectContext } from '../App';
import logo from '../load.gif';

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
            console.log("unmatched new/confirmed password")
            setError("Unmatched new/confirmed password!");
            return;
        }
        setError(null);
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
            throw Error("Invalid old password!");
          } 
          return res.json();
        })
        .then(data => {
          console.log("valid change account");
          console.log(data);
          setWaiting(false);
          setError(null);
          console.log("fetch "+url);
          setInstruction("Success!");
          setTimeout(() => {
            clearField();
            props.setTrigger(false);
          }, 2000)
        })
        .catch(err => {
          setWaiting(false);
          setError(err.message);
        })        
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner user'>
            <div className='popup-header'>
                <span className='popup-title'>Change Password</span>
                <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
            </div>
                <form onSubmit={handleSubmit} className="form">
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
                    <button className='btn btn-danger' type='button' onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      ): ""
}