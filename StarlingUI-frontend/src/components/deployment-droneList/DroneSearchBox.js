import React from 'react'

export default function DroneSearchBox( {setSearchDrone, searchDrone} ) {
  return (
    <>
    <input 
            className='image__search project__search drone'
            type="search"
            value={searchDrone}
            onChange={(e)=>setSearchDrone(e.target.value)}></input>    
    </>
  )
}
