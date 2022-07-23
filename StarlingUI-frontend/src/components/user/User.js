import React, {useState, useContext} from 'react'
import { ProjectContext } from '../App';
import LoginIn from './LoginIn';
import UserDropDown from './UserDropDown';
import CreateAccount from './CreateAccount';
import ManageAccount from './ManageAccount';
import UnsavedWarning from './UnsavedWarning';
import account_icon from '../img/account-svgrepo-com.svg';

export default function User( {currentUser, userSignIn, setUserSignIn} ) {

    const {projects, currentUserID, handleCurrentUser} = useContext(ProjectContext);

    const [userManagement, setUserManagement] = useState(false);
    const [createNewAccount, setCreateNewAccount] = useState(false);
    const [accountManagement, setAccountManagement] = useState(false);

    const [unsavedWarning, setUnsavedWarning] = useState(false);
    const [unsavedProjectIDs, setUnsavedProjectIDs] = useState([]);

    function handleCreateNewAccount(clickEvent){
        setCreateNewAccount(clickEvent);
    }

    function handleUserSignIn(clickEvent){
        setUserSignIn(clickEvent);
    }

    function handleUserManagement(){
        if(userManagement===true){
            setUserManagement(false);
        }else{
            setUserManagement(true);
        }
    }

    function handleAccountManagement(clickEvent){
        console.log("manage account");
        setAccountManagement(clickEvent)
    }

    function handleUserSignOut(){
        console.log("sign out");
        //check if all his/her projects are saved
        checkAllSaved();
    }

    function checkAllSaved(){
        let unsavedArray=[];
        for(let i=0;i<projects.length;i++){
            if(projects[i].memberIDs.includes(currentUserID) && projects[i].saved===false){
                unsavedArray = [...unsavedArray, projects[i].id];
            }
        }
        console.log(unsavedArray);
        if(unsavedArray.length!==0){
            setUnsavedWarning(true);
            setUnsavedProjectIDs(unsavedArray);
            //show warning
        }
        else{
            console.log("all saved");
            setUnsavedWarning(false);
            handleCurrentUser(undefined);
        }
    }


    function showUser(){
        if(currentUser===undefined){
            return(
                <>
                <span className='btn btn-nav' onClick={()=>handleUserSignIn(true)}>Sign in</span>
                <LoginIn trigger={userSignIn} setTrigger={setUserSignIn} handleCreateNewAccount={handleCreateNewAccount}></LoginIn>
                <CreateAccount trigger={createNewAccount} setTrigger={setCreateNewAccount}></CreateAccount>
                </>
            )
        }else{
            return (
                <>
                <span className='btn btn-nav' onClick={()=>{handleUserManagement(); handleUserSignIn(false)}}>
                    <img className='account-icon' src={account_icon} alt="Account Icon"></img>{currentUser.name}</span>
                <UserDropDown trigger={userManagement} setTrigger={setUserManagement} 
                    handleAccountManagement={handleAccountManagement}
                    handleUserSignOut={handleUserSignOut}></UserDropDown>       
                <ManageAccount trigger={accountManagement} setTrigger={setAccountManagement} currentUser={currentUser}></ManageAccount>
                <UnsavedWarning trigger={unsavedWarning} setTrigger={setUnsavedWarning} unsavedProjectIDs={unsavedProjectIDs}></UnsavedWarning>
                </>
            );
        }
    }
  
return (
    <>{showUser()}</>
  )
}
