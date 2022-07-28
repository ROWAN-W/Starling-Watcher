import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { ProjectContext } from './App';
import User from "./user/User";

const Navbar = () => {
  const {userSignIn, setUserSignIn, userData, currentUserID} = useContext(ProjectContext);

  return (
    <nav className="nav">
      <h1 className="nav-title">Starling</h1>
      <ul className="nav-list">
        <li><Link to="/">Deployment</Link></li>
        <li><Link to="/monitor">Monitor</Link></li>
      </ul>
      <div><User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={userData?.find(user => user.id === currentUserID)}></User></div>
    </nav>
  );
}
 
export default Navbar;