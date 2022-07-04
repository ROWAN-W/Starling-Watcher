import React, {useState} from 'react';
import classnames from 'classnames';

export default function DroneItemSelection({options,addDrone}) {
    
    const [isActive, setIsActive] = useState(false);

    //drone now is name, not id
    return <div className="dropdown-container">
        <div className="dropdown-input" onClick={() => setIsActive(!isActive)}>
            <div className='dropdown-values'><div onClick={() => setIsActive(!isActive)} className='dropdown-placeholder'>Add drones</div></div>
        </div>
    
        <div className={classnames('dropdown-options', { 'dropdown-active': isActive })}>
          {options?.map(item =>
            <div onClick={() => {addDrone(item.nodeName);setIsActive(!isActive)}} className="dropdown-item" key={item.id}>
              {item.nodeName}
            </div>
          )}
        </div>
      </div>
    }