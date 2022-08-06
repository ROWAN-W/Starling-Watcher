import React,{useState} from 'react'
import classnames from 'classnames';

export default function MemberSelection({options,addMember}) {

    const [isActive, setIsActive] = useState(false)
    
return <div className="dropdown-container">
    <div className="dropdown-input" onClick={() => setIsActive(!isActive)}>
        <div className='dropdown-values'><div onClick={() => setIsActive(!isActive)} className='dropdown-placeholder'>Add users</div></div>
    </div>

    <div className={classnames('dropdown-options', { 'dropdown-active': isActive })}>
      {options?.map(item =>
        <div onClick={() => {addMember(item.id);setIsActive(!isActive)}} className="dropdown-item" key={item.id}>
          {item.name}
        </div>
      )}
    </div>
  </div>
}