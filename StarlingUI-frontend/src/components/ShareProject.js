import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from './App';
import Member from './Member';
import MemberSelection from './MemberSelection';

export default function ShareProject(props) {

    const {users, currentUserID, handleProjectChange} = useContext(ProjectContext);

    const [existingMembers, setExistingMembers] = useState(props.selectedProject?.memberIDs);


    useEffect(()=>{
        console.log("rendered in share");
        setExistingMembers(props.selectedProject?.memberIDs);
      },[props.selectedProject?.memberIDs]);
    
    function handleChange(changes){
        handleProjectChange(props.selectedProject.id, {...props.selectedProject,...changes});
    }

    function saveChange(){
        console.log("save change");
        console.log(existingMembers);
        console.log(currentUserID);
        const result = existingMembers.find(member=>member===currentUserID);
        if(result===undefined){
            console.log("delete yourself");
            //sign out to make the data sync
            props.setWarning(true);
        }
        handleChange({memberIDs: existingMembers});        
    }
        
    function removeMember(id){
        console.log("remove member");

        setExistingMembers(existingMembers.filter(member=>member!==id));
        
    }

    function addMember(id){
        console.log("add member");
        setExistingMembers([...existingMembers,id]);
        
        
    }

    //v is id
    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>props.setTrigger(false)}>&times;</button>
                <h3>Share {props.selectedProject.name}</h3>
                <h4>People with access</h4>
                {existingMembers?.map(member=><div key={member}><Member owner={props.selectedProject.ownerID} member={member} removeMember={removeMember}></Member></div>)}
                <MemberSelection addMember={addMember} options={users.filter(x => !existingMembers?.includes(x.id))}></MemberSelection>
                <div>
                <button onClick={()=>{saveChange();props.setTrigger(false)}}>Save</button><button onClick={()=>props.setTrigger(false)}>Cancel</button>
                </div>
            </div>
        </div>
      ): ""
}