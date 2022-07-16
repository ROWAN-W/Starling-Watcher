import React, {useState} from 'react'
import ContainerSetting from './ContainerSetting';
import imagedel from '../img/delete-svgrepo-com.svg';
import imageset from '../img/setting-svgrepo-com.svg';

export default function Container({image, handleImageDelete, handleContainerChange}) {  

  const[setting, setSetting] = useState(false);
  
    return (
    <>
    <div className='items-body-content node-image'>
      <span className='image-name' onClick={()=>setSetting(true)}>{image.name}</span>
      <img className="setting-node-image-icon" src={imageset} alt="setting" onClick={()=>setSetting(true)}/>
      <img className="delete-icon" src={imagedel} alt="delete" onClick = {()=>handleImageDelete(image.id)}/>
    </div>
    <ContainerSetting trigger={setting} setTrigger={setSetting} container={image} handleContainerChange={handleContainerChange}></ContainerSetting>
    </>
  )
}

//<div className='image-tag-content' onClick={()=>setSetting(true)}>{image.name}</div>
//<button className="material-symbols-outlined" onClick = {()=>handleImageDelete(image.id)}>&times;</button>
