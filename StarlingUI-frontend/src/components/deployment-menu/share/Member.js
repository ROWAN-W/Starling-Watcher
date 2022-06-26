import React, {useContext} from 'react';
import { ProjectContext } from '../../App';

export default function Member({owner,member,removeMember}) {

    const {currentUserID, users} = useContext(ProjectContext);
    
    function showProjectMember(){
        if(member===owner){
            return(
                <div>{users.find(user=>user.id===owner).name}&nbsp;(project owner)</div>
            )
        }
        else{
            return(
                <div>{users.find(user=>user.id===member).name}{owner===currentUserID && <span className='dropdown-remove' onClick={() => removeMember(member)}>&times;</span>}</div>
            )
        }
    }
  
    
    return (
    <div>{showProjectMember()}</div>
  )
}
