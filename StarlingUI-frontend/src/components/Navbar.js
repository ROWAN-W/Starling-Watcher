import { Link } from "react-router-dom";
import React,{useContext, useState} from 'react';
import { ProjectContext } from './App';
import User from "./user/User";

const Navbar = () => {
  const {userSignIn, setUserSignIn, userData, currentUserID} = useContext(ProjectContext);

  const [selectedPage, setSelectedPage] = useState('Deployment');

  return (
    <nav className="nav">
      <h1 className="nav-title">Starling</h1>
      <ul className="nav-list">
        <li onClick={()=>{setSelectedPage('Deployment')}} className={selectedPage==='Deployment'? "nav-list click": null}><Link to="/">Design</Link></li>
        <li onClick={()=>{setSelectedPage('Monitor')}} className={selectedPage==='Monitor'? "nav-list click": null}><Link to="/monitor">Monitor</Link></li>
      </ul>
      <div><User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={userData?.find(user => user.id === currentUserID)}></User></div>
    </nav>
  );
}

export default Navbar;