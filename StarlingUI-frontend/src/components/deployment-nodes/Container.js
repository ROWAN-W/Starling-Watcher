import React, {useState} from 'react'
import ContainerSetting from './ContainerSetting';

export default function Container({image, handleImageDelete, handleContainerChange}) {  

  const[setting, setSetting] = useState(false);
  
    return (
    <>
    <div className='image-tag'>
        <div className='image-tag-content' onClick={()=>setSetting(true)}>{image.name}</div>
        <button className="material-symbols-outlined" onClick = {()=>handleImageDelete(image.id)}>close</button>
    </div>
    <ContainerSetting trigger={setting} setTrigger={setSetting} container={image} handleContainerChange={handleContainerChange}></ContainerSetting>
    </>
  )
}
