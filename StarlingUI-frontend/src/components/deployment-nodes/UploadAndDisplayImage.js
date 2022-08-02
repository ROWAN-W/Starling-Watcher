import React from "react";

export default function UploadAndDisplayImage({options, selectedImage, setSelectedImage}) {

    return (
      <>
      <div className='sub-title'><span>Picture Select (Optional)</span></div>
        <div className='popup-secondary picture-select'>
        <label className="info-msg wordwrap"><i className="fa fa-info-circle"></i>Either 'None' on master or deployment will remove all the pictures. <strong>Specify both to display the pictures</strong>.</label>
        {selectedImage!=="None" && (
          <div>
          <img className="picture-select" alt="picture" width={"180px"} src={selectedImage}/> 
          </div>
        )}
        <div>
            <select className='dropdown-select picture-select' value={selectedImage} onChange={e=>{setSelectedImage(e.target.value)}}>
                <option value={options[0]} >Circle-Drone</option>
                <option value={options[1]} >Circle-Computer</option>
                <option value={options[2]} >None</option>
            </select></div>
        </div>
      </>
    )
}
