import React from 'react';

//drone now is name, not id
export default function DroneItem({ allDrones, drone, removeDrone}) {
    
    return(
        <div>{drone}<span className='dropdown-remove' onClick={() => removeDrone(drone)}>&times;</span></div>
    )
}
