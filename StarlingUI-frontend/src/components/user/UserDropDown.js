import React from 'react';


export default function UserDropDown(props) {

return (props.trigger) ? (
    <ul className='user-dropdown'>
        <li onClick={()=>{props.handleAccountManagement(true); props.setTrigger(false)}}><a href="#">Manage My Account</a></li>
        <li onClick={()=>{props.handleUserSignOut();props.setTrigger(false);}}><a href="#">Sign out</a></li>
    </ul>
  ): ""
}