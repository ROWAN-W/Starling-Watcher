import React from 'react'

export default function ImageSort({setSortValue, setOrder}) {
  return (
    <>
        <span className='image__sort__span'>sort</span>
        <select className='image__sort'  onChange={e=>{setSortValue(e.target.value.split('-')[0]);setOrder(e.target.value.split('-')[1])}}>
            <option value="lastUpdated-DSC">Date (latest)</option>
            <option value="lastUpdated-ASC">Date (oldest)</option>
            <option value="name-ASC">Name (A-Z)</option>
            <option value="name-DSC">Name (Z-A)</option>
        </select>
    </>
  )
}
