import React from 'react'

export default function Filter({filterValue, setFilterValue}) {
  return (
    <>
        <select value={filterValue} onChange={e=>setFilterValue(e.target.value)}>
            <option value="all">All</option>
            <option value="master">Master</option>
            <option value="deployment">Deployment</option>
        </select>
    </>
  )
}
