import React from 'react'

export default function SearchBox( {setSearchNode, searchNode} ) {
    
    return (
    <>
    <input 
            className='node__search image__search'
            type="search"
            placeholder='search name'
            value={searchNode}
            onChange={(e)=>setSearchNode(e.target.value)}></input>    
    </>
  )
}