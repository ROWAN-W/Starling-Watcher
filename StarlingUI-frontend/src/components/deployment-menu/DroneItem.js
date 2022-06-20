import React from 'react';

export default function DroneItem({allDrones, drone, removeDrone}) {
    
    return(
        <div>{allDrones.find(d=>d.id===drone).name}<span className='dropdown-remove' onClick={() => removeDrone(drone)}>&times;</span></div>
    )
}
