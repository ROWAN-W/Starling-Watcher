import React from 'react'

export default function SearchBox( {handleImageSearch} ) {
    return (
    <>
        <input 
            className='image__search'
            type="search"
            placeholder='search' 
            onChange={(e)=>handleImageSearch(e.target.value)}></input>
    </>
  )
}
