import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../App';
import DockerLogin from './DockerLogin';
import Image from './Image';
import useFetch from '../useFetch';

export default function ImageList() {

  const { images, handleImageListChange} = useContext(ProjectContext);

  const [userSignIn, setUserSignIn] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showSwitchButton, setSwitchButton] = useState(true);

  const { error: imageError, isPending: imagePending , data:imagesData } = useFetch('http://localhost:8003/sampleImage',[])

  useEffect(()=>{
    console.log("render in image list");
    if(imagesData!==null){
      handleImageListChange(imagesData[0].images);
    }
  },[imagesData]);

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
      { (imageError ) && <div>{ imageError }</div> }
      { (imagePending ) && <div>Loading...</div> }
      { (images ) &&
        <>
        {showInstruction()}
        {showSwitchInstruction()}
        {showSignOutInstruction()}
        <div>
            <DockerLogin trigger={userSignIn} setTrigger={setUserSignIn} setShowButton={setShowButton} setSwitchButton={setSwitchButton} dockerAccounts={imagesData}></DockerLogin>
        </div>
        
        {images.map(image=>{
            return <Image key={image.id} {...image}></Image>
        })}
        </>
      }
      </div>
    </>
  )
}
