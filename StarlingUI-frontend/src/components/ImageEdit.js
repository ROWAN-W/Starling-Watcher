import React from 'react'

export default function ImageEdit({image, handleImageDelete}) {  
  
    return (
    <div className='image-tag'>
        <div className='image-tag-content'>{image.name}</div>
        <button className="material-symbols-outlined" onClick = {()=>handleImageDelete(image.id)}>close</button>
    </div>
  )
}
