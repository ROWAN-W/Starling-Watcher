import React from 'react'

export default function SearchType({searchType, setSearchType}) {
  return (
    <>
        <select className='project-search-type' value={searchType} onChange={e=>{setSearchType(e.target.value)}}>
            <option value="name">Project Name</option>
            <option value="id">Project ID</option>
            <option value="dateModified">Last Save</option>
            <option value="lastModifiedBy">Last Save by(ID)</option>
        </select>
    </>
  )
}
