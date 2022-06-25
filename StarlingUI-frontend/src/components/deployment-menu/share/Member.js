import React, {useContext} from 'react';
import { ProjectContext } from '../../App';

export default function Member({owner,member,removeMember}) {

    const {users} = useContext(ProjectContext);
    
    function showProjectMember(){
        if(member===owner){
            //cannot delete the owner
            return(
                <div>{users.find(user=>user.id===owner).name}&nbsp;(owner)</div>
            )
        }else{
            return(
                <div>{users.find(user=>user.id===member).name}<span className='dropdown-remove' onClick={() => removeMember(member)}>&times;</span></div>
            )
        }
    }
  
    
    return (
    <div>{showProjectMember()}</div>
  )
}
