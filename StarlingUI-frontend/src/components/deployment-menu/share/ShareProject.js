import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../../App';
import Member from './Member';
import MemberSelection from './MemberSelection';

export default function ShareProject(props) {

    const {userData, currentUserID, handleProjectChange} = useContext(ProjectContext);

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
                <div className='popup-header owner'>
                    <span className='popup-title wordwrap wordbreak'>Share {props.selectedProject.name}</span>
                    <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                </div>

                <div className="share">
                <MemberSelection addMember={addMember} options={userData.filter(x => !existingMembers?.includes(x.id))}></MemberSelection>
                
                <div className="people-list">People with access</div>
                {existingMembers?.map(member=><div key={member}><Member owner={props.selectedProject.ownerID} member={member} removeMember={removeMember}></Member></div>)}
                </div>
                
                <div className='popup-footer normal'>
                    <button className='btn btn-primary' onClick={()=>{saveChange();props.setTrigger(false)}}>Done</button>
                    <button className='btn btn-cancel' onClick={()=>{props.setTrigger(false);clearField()}}>Cancel</button>
                </div>
                </>
            )
        }
        else{
            return(
                <>
                <div className='popup-header'>
                    <span className='popup-title wordwrap wordbreak'>Members of {props.selectedProject.name}</span>
                    <button className='popup-close-button' onClick={()=>{props.setTrigger(false);clearField()}}>&times;</button>
                </div>
                
                <div className="info-msg wordwrap">
                <i className="fa fa-info-circle"></i>
                Only project owner can add/delete members.
                </div>

                <div className="people-list">People with access</div>
                {existingMembers?.map(member=><div key={member}><Member owner={props.selectedProject.ownerID} member={member} removeMember={removeMember}></Member></div>)}

                <div className='popup-footer normal'>
                <button className='btn short' onClick={()=>{props.setTrigger(false)}}>OK</button>
                </div>
                </>
            )
        }
    }

    return (props.trigger) ?(
        <div className='popup-projects'>
            <div className='popup-projects-inner'>
                {content()}
            </div>
        </div>
      ): ""
}