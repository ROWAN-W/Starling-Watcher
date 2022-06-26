import React, {useState, useContext} from 'react'
import { ProjectContext } from '../App';
import LoginIn from './LoginIn';
import UserDropDown from './UserDropDown';
import CreateAccount from './CreateAccount';
import ManageAccount from './ManageAccount';
import UnsavedWarning from './UnsavedWarning';

export default function User( {currentUser, userSignIn, setUserSignIn} ) {

    const {projects, currentUserID, handleCurrentUser} = useContext(ProjectContext);

    const [userManagement, setUserManagement] = useState(false);
    const [createNewAccount, setCreateNewAccount] = useState(false);
    const [accountManagement, setAccountManagement] = useState(false);

    const [unsavedWarning, setUnsavedWarning] = useState(false);
    const [unsavedProjectNames, setUnsavedProjectNames] = useState([]);

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

    function handleUserSignOut(){
        console.log("sign out");
        //check if all his/her projects are saved
        checkAllSaved();
    }

    function checkAllSaved(){
        let unsavedArray=[];
        for(let i=0;i<projects.length;i++){
            if(projects[i].memberIDs.includes(currentUserID) && projects[i].saved===false){
                unsavedArray = [...unsavedArray, projects[i].name];
            }
        }
        console.log(unsavedArray);
        if(unsavedArray.length!==0){
            setUnsavedWarning(true);
            setUnsavedProjectNames(unsavedArray);
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
                    <UserDropDown trigger={userManagement} setTrigger={setUserManagement} 
                    handleAccountManagement={handleAccountManagement}
                    handleUserSignOut={handleUserSignOut}></UserDropDown>
                </div>
                <ManageAccount trigger={accountManagement} setTrigger={setAccountManagement} currentUser={currentUser}></ManageAccount>
                <UnsavedWarning trigger={unsavedWarning} setTrigger={setUnsavedWarning} unsavedProjectNames={unsavedProjectNames}></UnsavedWarning>
                </>
            );
        }
    }
  
return (
    <div className='user-tag'>{showUser()}</div>
  )
}