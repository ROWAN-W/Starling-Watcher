import { Link } from "react-router-dom";
import React,{useContext} from 'react';
import FontSizeChanger from 'react-font-size-changer';
import { ProjectContext } from './App';
import User from "./user/User";
import bigger from './img/font-increase-svgrepo-com.png';
import smaller from './img/font-decrease-svgrepo-com.png';

const Navbar = () => {
  const {userSignIn, setUserSignIn, userData, currentUserID, selectedPage, setSelectedPage} = useContext(ProjectContext);

  return (
    <nav className="nav">
      <h1 className="nav-title">Starling</h1>
      <ul className="nav-list">
        <li onClick={()=>{setSelectedPage('Deployment')}} className={selectedPage==='Deployment'? "nav-list click": null}><Link to="/">Design</Link></li>
        <li onClick={()=>{setSelectedPage('Monitor')}} className={selectedPage==='Monitor'? "nav-list click": null}><Link to="/monitor">Monitor</Link></li>
      </ul>
      <div className="font-changer-user">
      {selectedPage==='Deployment' && <div className="font-changer"><FontSizeChanger
        targets={['html']}
        options={{
          stepSize: 1,
          range: 3
        }}
        customButtons={{
          up: <img className="font-changer-big" src={bigger} alt="font-bigger" />,
          down: <img className="font-changer-small" src={smaller} alt="font-smaller" />,
          style: {
            backgroundColor: 'transparent',
            WebkitBoxSizing: 'border-box',
            height: '25px',
            width: '35px',
            border: 'none',
            color: 'white',
            WebkitBorderRadius: '.2rem',
          },
          buttonsMargin: 5
        }}
      /></div>}
        <User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={userData?.find(user => user.id === currentUserID)}></User>
      </div>
    </nav>
  );
}

export default Navbar;