import React from "react";

export default function UploadAndDisplayImage({options, selectedImage, setSelectedImage}) {

    return (
      <>
      <div className='sub-title'><span>Picture Select</span></div>
        <div className='popup-secondary picture-select'>
        {selectedImage!=="None" && (
          <div>
          <img className="picture-select" alt="picture" width={"250px"} src={selectedImage}/> 
          </div>
        )}
        <label className="info-msg wordwrap"><i className="fa fa-info-circle"></i>Either 'None' on master or deployment will remove all the pictures. Specify both to display the pictures.</label>
        <div>
            <select className='dropdown-select picture-select' value={selectedImage} onChange={e=>{setSelectedImage(e.target.value)}}>
                <option value={options[0]} >Simple-Drone</option>
                <option value={options[1]} >Simple-Computer</option>
                <option value={options[2]} >Circle-Drone</option>
                <option value={options[3]} >Circle-Computer</option>
                <option value={options[4]} >None</option>
            </select></div>
        </div>
      </>
    )
}