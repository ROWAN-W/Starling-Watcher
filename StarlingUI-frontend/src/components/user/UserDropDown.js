import React, {useContext} from 'react';
import { ProjectContext } from '../App';


export default function UserDropDown(props) {

const {handleCurrentUser} = useContext(ProjectContext);

function signOut(){
    console.log("sign out");
    handleCurrentUser(undefined);
}

return (props.trigger) ? (
    <div className='user-dropdown'>
        <div className='user-dropdown-inner'>
            <button className='user-dropdown-item' onClick={()=>{props.handleAccountManagement(true); props.setTrigger(false)}}>Manage My Account</button>
            <button className='user-dropdown-item' onClick={()=>{signOut();props.setTrigger(false);}}>Sign out</button>
        </div>
    </div>
  ): ""
}
