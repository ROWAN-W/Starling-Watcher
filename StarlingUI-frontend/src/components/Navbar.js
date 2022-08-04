import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React,{useContext} from 'react';
import FontSizeChanger from 'react-font-size-changer';
import { ProjectContext } from './App';
import User from "./user/User";
import bigger from './img/font-increase-svgrepo-com.png';
import smaller from './img/font-decrease-svgrepo-com.png';
import bird from './img/raven-svgrepo-com.svg';

const Navbar = () => {
  const history = useHistory()
  const {userSignIn, setUserSignIn, userData, currentUserID, selectedPage, setSelectedPage} = useContext(ProjectContext);

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  function goHome(){
    if(selectedPage==='/'){
      window.location.reload(false)
    }else{
      setSelectedPage('/');history.push('/')
    }
  }

  return (
    <nav className="nav">
      <div className="starling-with-logo" title="Home" onClick={()=>{goHome()}}><img className="bird-icon" src={bird} alt="starling logo" /><h1 className="nav-title" >Starling<span className="watcher">Watcher</span></h1></div>
      <ul className="nav-list">
        <li className={selectedPage==='/'? "nav-list click": null}><Link to="/"><span onClick={()=>{setSelectedPage('/')}}>Design</span></Link></li>
        <li className={selectedPage==='/monitor'? "nav-list click": null}><Link to="/monitor"><span onClick={()=>{setSelectedPage('/monitor')}}>Monitor</span></Link></li>
        <li><a href="/#" onClick={() => openInNewTab('https://www.notion.so/Help-Centre-4092371e72e745eca6c56f236babc998')}>FAQ</a></li>
      </ul>
      <div className="font-changer"><FontSizeChanger
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
          buttonsMargin: 10
        }}
      /></div>
        <User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={userData?.find(user => user.id === currentUserID)}></User>
    </nav>
  );
}

export default Navbar;