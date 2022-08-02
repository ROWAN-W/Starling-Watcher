import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React,{useContext} from 'react';
import FontSizeChanger from 'react-font-size-changer';
import { ProjectContext } from './App';
import User from "./user/User";
import bigger from './img/font-increase-svgrepo-com.png';
import smaller from './img/font-decrease-svgrepo-com.png';
import bird from './img/bird.png';

const Navbar = () => {
  const history = useHistory()
  const {userSignIn, setUserSignIn, userData, currentUserID, selectedPage, setSelectedPage} = useContext(ProjectContext);

  return (
    <nav className="nav">
      <div className="starling-with-logo" title="go to Home" onClick={()=>{setSelectedPage('Deployment');history.push('/')}}><img className="bird-icon" src={bird} alt="starling logo" /><h1 className="nav-title" >Starling</h1></div>
      <ul className="nav-list">
        <li className={selectedPage==='Deployment'? "nav-list click": null}><Link to="/"><span onClick={()=>{setSelectedPage('Deployment')}}>Design</span></Link></li>
        <li className={selectedPage==='Monitor'? "nav-list click": null}><Link to="/monitor"><span onClick={()=>{setSelectedPage('Monitor')}}>Monitor</span></Link></li>
      </ul>
      <div className="font-changer-user">
      {selectedPage==='Deployment' && <div className="font-changer"><FontSizeChanger
        targets={['html']}
        options={{
          stepSize: 1,
          range: 5
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