import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../../App';
import Member from './Member';
import MemberSelection from './MemberSelection';

export default function ShareProject(props) {

    const {users, currentUserID, handleProjectChange} = useContext(ProjectContext);

    const [existingMembers, setExistingMembers] = useState([]);


    useEffect(()=>{
        if(props.trigger===true){
            console.log("rendered in share");
            setExistingMembers(props.selectedProject?.memberIDs);
        }
      },[props.trigger]);
    
    function handleChange(changes){
        handleProjectChange(props.selectedProject.id, {...props.selectedProject,...changes});
    }

    function saveChange(){
        const result = existingMembers.find(member=>member===currentUserID);
        if(result===undefined){
            console.log("delete yourself");
            //sign out to make the data sync
            props.setWarning(true);
        }
        handleChange({memberIDs: existingMembers});        
    }

    function clearField(){
        setExistingMembers(props.selectedProject.memberIDs);
    }
        
    function removeMember(id){
        console.log("remove member");
        setExistingMembers(existingMembers.filter(member=>member!==id));
    }

    function addMember(id){
        console.log("add member");
        setExistingMembers([...existingMembers,id]);
    }

    function content(){
        if(props.selectedProject.ownerID===currentUserID){
            return(
                <>
                <h3>Share {props.selectedProject.name}</h3>
                <MemberSelection addMember={addMember} options={users.filter(x => !existingMembers?.includes(x.id))}></MemberSelection>
                <p></p>
                <div>People with access</div>
                {existingMembers?.map(member=><div key={member}><Member owner={props.selectedProject.ownerID} member={member} removeMember={removeMember}></Member></div>)}
                <div>
                <button onClick={()=>{saveChange();props.setTrigger(false)}}>Done</button><button onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                </div>
                </>
            )
        }
        else{
            return(
                <>
                <h3>Members of {props.selectedProject.name}</h3>
                <p>Only project owner can add/delete members.</p>
                {existingMembers?.map(member=><div key={member}><Member owner={props.selectedProject.ownerID} member={member} removeMember={removeMember}></Member></div>)}
                <div>
                <button onClick={()=>{props.setTrigger(false)}}>OK</button>
                </div>
                </>
            )
        }
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
            <button className='popup-close-btn' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                {content()}
            </div>
        </div>
      ): ""
}