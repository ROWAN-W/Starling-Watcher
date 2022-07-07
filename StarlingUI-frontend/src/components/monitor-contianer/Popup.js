import {useEffect,useState} from "react";

export default function Popup(props){
    useEffect(()=>{

    })


    return(props.visible)?(
        <>
            <div className='terminal-container'>
                <div className='terminal-header'>
                    <p>container-name</p>
                    <button className='close-btn' onClick={() => props.setVisible(false)}>close</button>
                </div>
                <div id='terminal'></div>
            </div>
        </>
    ):"";
}