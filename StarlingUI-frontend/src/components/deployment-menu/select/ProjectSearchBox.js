import React from 'react'

export default function ProjectSearchBox( {setSearchProject, searchProject} ) {
  return (
    <>
    <input 
            className='image__search project__search'
            type="search"
            value={searchProject}
            onChange={(e)=>setSearchProject(e.target.value)}></input>    
    </>
  )
}
