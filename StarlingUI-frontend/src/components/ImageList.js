import React, {useState, useContext} from 'react';
import { ProjectContext } from './App';
import DockerLogin from './DockerLogin';
import Image from './Image';

export default function ImageList() {

  const {images, handleImageListChange} = useContext(ProjectContext);

  const [userSignIn, setUserSignIn] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showSwitchButton, setSwitchButton] = useState(false);

  function showInstruction(){
    if(images.length===0 && showButton){
      return <button onClick={()=>{setUserSignIn(true); setShowButton(false);}}>docker hub login</button>
    }
  }

  function showSwitchInstruction(){
    if(images.length!==0 && showSwitchButton){
      return <button onClick={()=>{setUserSignIn(true); setSwitchButton(false);}}>switch docker hub account</button>
    }
  }

  function showSignOutInstruction(){
    if(images.length!==0 && showSwitchButton){
      return <button onClick={()=>{setUserSignIn(false); setSwitchButton(false); setShowButton(true); handleImageListChange([])}}>logout</button>
    }
  }

    return (
    <>
      <div className='image-tag-container'>
        {showInstruction()}
        {showSwitchInstruction()}
        {showSignOutInstruction()}
        <div>
            <DockerLogin trigger={userSignIn} setTrigger={setUserSignIn} setShowButton={setShowButton} setSwitchButton={setSwitchButton}></DockerLogin>
        </div>
        
        {images.map(image=>{
            return <Image key={image.id} {...image}></Image>
        })}
      </div>
    </>
  )
}
