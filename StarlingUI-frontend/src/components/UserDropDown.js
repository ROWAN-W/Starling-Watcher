import React, {useContext} from 'react';
import { ProjectContext } from './App';


export default function UserDropDown(props) {

const {handleCurrentUser} = useContext(ProjectContext);

function signOut(){
    console.log("sign out");
    handleCurrentUser(undefined);
}

return (props.trigger) ? (
    <div className='user-dropdown'>
        <div className='popup-projects-inner'>
            <p onClick={()=>{props.handleAccountManagement(true); props.setTrigger(false)}}>Manage My Account</p>
            <p onClick={()=>{signOut();props.setTrigger(false);}}>Sign out</p>
        </div>
    </div>
  ): ""
}
