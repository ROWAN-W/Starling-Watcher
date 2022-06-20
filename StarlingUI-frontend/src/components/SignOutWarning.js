import React,{useContext} from 'react';
import { ProjectContext } from './App';

export default function SignOutWarning(props) {

    const {handleCurrentUser} = useContext(ProjectContext);

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                <p>{props.massage}</p>
                <button onClick={()=>{props.setTrigger(false);handleCurrentUser(undefined)}}>OK</button>
            </div>
        </div>
      ): ""
}