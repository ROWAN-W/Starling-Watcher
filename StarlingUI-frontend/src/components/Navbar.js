import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import { ProjectContext } from './App';
import User from "./user/User";

const Navbar = (props) => {
  const {userSignIn, setUserSignIn, userData, currentUserID} = useContext(ProjectContext);

  return (props.visible)?(
    <nav className="nav">
      <h1 className="nav-title">Starling</h1>
      <ul className="nav-list">
        <li><Link to="/">Deployment</Link></li>
        <li><Link to="/monitor">Monitor</Link></li>
        <li>{ userData && <User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={userData?.find(user => user.id === currentUserID)}></User>}</li>
      </ul>
    </nav>
  ):null;
}
 
export default Navbar;