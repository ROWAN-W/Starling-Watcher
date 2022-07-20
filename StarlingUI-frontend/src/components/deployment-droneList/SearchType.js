import React from 'react'

export default function SearchType({searchType, setSearchType}) {
  return (
    <>
        <select className='drone-search-type' value={searchType} onChange={e=>{setSearchType(e.target.value)}}>
            <option value="nodeName">Name</option>
            <option value="hostname">Host</option>
            <option value="ip">IP</option>
            <option value="role">Role</option>
            <option value="architecture">Architecture</option>
            <option value="labels">Labels</option>
            <option value="annotations">Annotations</option>
            <option value="creationTime">Create Time</option>
        </select>
    </>
  )
}
