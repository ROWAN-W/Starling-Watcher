import React, {useState,useEffect} from 'react';
import DroneItemSelection from './DroneItemSelection';
import DroneItem from './DroneItem';

export default function DeployPerNode({nodeToMap, completeNode, allDrones, handleMappingChange, selectedDrones,setSelectedDrones,sync, setSync}) {

    const [mappedDrones, setMappedDrones] = useState(nodeToMap.mappedDrones);

    useEffect(()=>{
        console.log("rendered in deploy per node first time");
        if(sync===true){
          setSync(false);
          removeAll();
        }
      },[mappedDrones,sync]);
    
    function handleChange(changes){
        console.log("change"+nodeToMap.nodeID);
        handleMappingChange(nodeToMap.nodeID, {...nodeToMap,...changes});
    }
        
    function removeDrone(id){
        console.log("remove drone");
        setMappedDrones(mappedDrones.filter(drone=>drone!==id));
        setSelectedDrones(selectedDrones.filter(drone=>drone!==id));
        handleChange({mappedDrones: mappedDrones.filter(drone=>drone!==id)});
    }

    function addDrone(id){
        console.log("add drone");
        setMappedDrones([...mappedDrones,id]);
        setSelectedDrones([...selectedDrones,id])
        handleChange({mappedDrones: [...mappedDrones,id]});
    }

    function removeAll(){
      console.log("remove all");
      setMappedDrones([]);
      setSelectedDrones([]);
    }


  return (
    <>
    <div>{completeNode.name} ({completeNode.kind}):</div>
    {mappedDrones?.map(drone=><div key={drone}><DroneItem  allDrones={allDrones} drone={drone} removeDrone={removeDrone}></DroneItem></div>)}
        <DroneItemSelection 
        addDrone={addDrone} 
        options={allDrones?.filter(x => !selectedDrones?.includes(x.id))}></DroneItemSelection>
    </>
  )
}
