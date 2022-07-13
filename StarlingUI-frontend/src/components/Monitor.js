import React, {useEffect, useContext, useState} from 'react';

export default function Monitor() {

  //for testing
  const [data,setData]=useState(null);
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);
  const [updateTime, setUpdateTime] = useState();
  const [updateClick, setUpdateClick] = useState(false);

  
  useEffect(() => {
    //replace with Rowan's
    const url = "http://localhost:8080/monitor/nodes";
          
          fetch(url)
          .then(res => {
            if (!res.ok) { // error coming back from server
                throw Error('Error Details: '+res.status);
            } 
            return res.json();
          })
          .then(data => {
            setWaiting(false);
            setData(data);
            setError(null);
            console.log("fetch "+url);
          })
          .catch(err => {
            // auto catches network / connection error
            setData();
            setWaiting(false);
            setError(err.message);
          })
      setUpdateTime(new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString());
    
  },[updateClick])

  

  function handleUpdateTime(){
    setWaiting(true);
    setError(null);
    setData(); //clear data
    setUpdateClick(prev=>!prev);
  }

  return (
    <>
    <div>Monitor</div>
    <button onClick={()=>{handleUpdateTime();}}>Sync</button>
    <div>Time: {updateTime}</div>

    {waiting && <div>Please wait...</div>}
    {error && <div>{ error }</div>}
    { data &&
    <div>
    {data.map(d=>{
      return (<li key={d.nodeName}>{d.nodeName}</li>)
    })}
    </div>
    }
    </>
  )
}
