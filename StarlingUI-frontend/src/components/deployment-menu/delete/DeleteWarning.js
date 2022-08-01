import React, {useContext, useState,useEffect} from 'react';
import { ProjectContext } from '../../App';
import warning from '../../img/warning-svgrepo-com.svg';

export default function DeleteWarning(props) {

    const {currentUserID} = useContext(ProjectContext);

    const [hide, setHide] = useState(props.hideWarning);

    let textInput = null;
    useEffect(()=>{
        if(props.trigger===true){
            textInput.focus();
        }
    })

    useEffect(()=>{
        //key friendly
        window.addEventListener('keydown', keyOperation);
            
        return () => { 
          window.removeEventListener('keydown', keyOperation);
        };
      },[]);
    
      function keyOperation(e){
        if(e.key==='Escape'||e.code==='Escape'){
          props.setTrigger(false)
        }
      }

    function message(){
        if(currentUserID===props.selectedProject.ownerID){
            console.log("it's owner");
            if(!props.hideWarning){
            return(
                <>
                <h2 className='title-error wordbreak wordwrap'><img className="warning" src={warning} alt="warning" />Delete {props.selectedProject.name}?</h2>
                <div className='content'>This action cannot be undone!
                <div className='hideAlert-option'><input type="checkbox" className='hideAlert' onChange={()=>{setHide(prev=>!prev)}} defaultChecked={false}/> <label htmlFor="hideAlert">Don't show this again</label></div>
                </div>
                <div className='key-hint'>(Press ENTER to delete, ESC to cancel)</div>
                <div className='popup-footer normal'>
                <button ref={(button) => { textInput = button; }} className="btn btn-danger" onClick={()=>{props.setTrigger(false);props.setProjectDelete(true);props.setHideWarning(hide)}}>Still Delete</button>
                <button className="btn btn-cancel" onClick={()=>{props.setTrigger(false);props.setHideWarning(hide)}}>Cancel</button>
                </div>
                </>
            )
            }
            else{
                props.setTrigger(false);props.setProjectDelete(true);
            }
        }else{
            console.log("cannot delete");
            return(
                <>
                <h2 className='title-error'>Can't delete</h2>
                <div className='content'>Only owner can delete the project</div>
                <div className='key-hint'>(Press ESC to leave)</div>
                <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false);}}>OK</button>
                </div>
                </>
            )
        }
    }
    
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup'>
            <button className='close' onClick={()=>props.setTrigger(false)}>&times;</button>
                {message()}
            </div>
        </div>
      ): ""
}
