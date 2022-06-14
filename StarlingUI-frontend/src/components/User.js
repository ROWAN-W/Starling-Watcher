import React, {useState} from 'react'
import LoginIn from './LoginIn';
import UserDropDown from './UserDropDown';
import CreateAccount from './CreateAccount';
import ManageAccount from './ManageAccount';

export default function User( {currentUser} ) {

    const [userSignIn, setUserSignIn] = useState(false);
    const [userManagement, setUserManagement] = useState(false);
    const [createNewAccount, setCreateNewAccount] = useState(false);
    const [accountManagement, setAccountManagement] = useState(false);

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
                <span onClick={()=>handleUserSignIn(true)}>&nbsp;&nbsp;Sign in&nbsp;&nbsp;</span>
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
                <ManageAccount trigger={accountManagement} setTrigger={setAccountManagement} currentUser={currentUser}></ManageAccount>
                </>
            );
        }
    }
  
return (
    <div className='user-tag'>{showUser()}</div>
  )
}
