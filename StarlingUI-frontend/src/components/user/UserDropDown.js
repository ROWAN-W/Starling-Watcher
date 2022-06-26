import React from 'react';


export default function UserDropDown(props) {

return (props.trigger) ? (
    <div className='user-dropdown'>
        <div className='user-dropdown-inner'>
            <button className='user-dropdown-item' onClick={()=>{props.handleAccountManagement(true); props.setTrigger(false)}}>Manage My Account</button>
            <button className='user-dropdown-item' onClick={()=>{props.handleUserSignOut();props.setTrigger(false);}}>Sign out</button>
        </div>
    </div>
  ): ""
}
