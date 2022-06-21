import React, {useState} from 'react'
import LoginIn from './LoginIn';
import UserDropDown from './UserDropDown';
import CreateAccount from './CreateAccount';
import ManageAccount from './ManageAccount';
import SignOutWarning from '../SignOutWarning';

export default function User( {currentUser, userSignIn, setUserSignIn} ) {

    //const [userSignIn, setUserSignIn] = useState(false);
    const [userManagement, setUserManagement] = useState(false);
    const [createNewAccount, setCreateNewAccount] = useState(false);
    const [accountManagement, setAccountManagement] = useState(false);
    const [warning, setWarning] = useState(false);

    function handleCreateNewAccount(clickEvent){
        setCreateNewAccount(clickEvent);
    }

    function handleUserSignIn(clickEvent){
        setUserSignIn(clickEvent);
    }

    function handleUserManagement(){
        if(userManagement==true){
            setUserManagement(false);
        }else{
            setUserManagement(true);
        }
    }

    function handleAccountManagement(clickEvent){
        console.log("manage account");
        setAccountManagement(clickEvent)
    }

    function showUser(){
        if(currentUser===undefined){
            return(
                <>
                <span onClick={()=>handleUserSignIn(true)}>Sign_in</span>
                <LoginIn trigger={userSignIn} setTrigger={setUserSignIn} handleCreateNewAccount={handleCreateNewAccount}></LoginIn>
                <CreateAccount trigger={createNewAccount} setTrigger={setCreateNewAccount}></CreateAccount>
                </>
            )
        }else{
            return (
                <>
                <div onClick={()=>{handleUserManagement(); handleUserSignIn(false); }}>
                    <button className="material-symbols-outlined">account_circle</button>
                    <span>{currentUser.name}</span>
                    <UserDropDown trigger={userManagement} setTrigger={setUserManagement} handleAccountManagement={handleAccountManagement}></UserDropDown>
                </div>
                <ManageAccount trigger={accountManagement} setTrigger={setAccountManagement} currentUser={currentUser} setWarning={setWarning}></ManageAccount>
                <SignOutWarning trigger={warning} setTrigger={setWarning} message="Due to account change, you will be logged out soon"></SignOutWarning>
                </>
            );
        }
    }
  
return (
    <div className='user-tag'>{showUser()}</div>
  )
}
