import React, {useState} from 'react';
import classnames from 'classnames';

export default function DroneItemSelection({completeNode,options,addDrone}) {
    
    const [isActive, setIsActive] = useState(false);

    //drone now is name, not id
    return(
      <div className='node-deploy'>
      <div className='node-list wordwrap wordbreak'>● {completeNode.name} ({completeNode.kind}):</div>
      <div className="dropdown-container">
        <div className="dropdown-input node-deploy" onClick={() => setIsActive(!isActive)}>
            <div className='dropdown-values node-deploy'><div onClick={() => setIsActive(!isActive)} className='dropdown-placeholder'>Add devices</div></div>
        </div>
      
        <div className={classnames('dropdown-options', { 'dropdown-active': isActive })}>
          {options?.map(item =>
            <div onClick={() => {addDrone(item.nodeName);setIsActive(!isActive)}} className="dropdown-item" key={item.id}>
              {item.nodeName}
            </div>
          )}
        </div>
      </div>
      </div>
    )
    }