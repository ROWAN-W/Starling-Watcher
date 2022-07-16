import React, {useState,useEffect} from 'react';
import DroneItemSelection from './DroneItemSelection';
import DroneItem from './DroneItem';

export default function DeployPerNode({nodeToMap, completeNode, allDrones, handleMappingChange, selectedDrones,setSelectedDrones,sync, setSync}) {

    const [mappedDrones, setMappedDrones] = useState(nodeToMap.mappedDrones);

    useEffect(()=>{
        if(sync===true){
          setSync(false);
          removeAll();
        }
      },[mappedDrones,sync]);
    
    function handleChange(changes){
        console.log("change"+nodeToMap.nodeID);
        handleMappingChange(nodeToMap.nodeID, {...nodeToMap,...changes});
    }

    //drone now is name, not id
    function removeDrone(name){
        console.log("remove drone");
        setMappedDrones(mappedDrones.filter(drone=>drone!==name));
        setSelectedDrones(selectedDrones.filter(drone=>drone!==name));
        handleChange({mappedDrones: mappedDrones.filter(drone=>drone!==name)});
    }

    //drone now is name, not id
    function addDrone(name){
        console.log("add drone");
        setMappedDrones([...mappedDrones,name]);
        setSelectedDrones([...selectedDrones,name])
        handleChange({mappedDrones: [...mappedDrones,name]});
    }

    function removeAll(){
      console.log("remove all");
      setMappedDrones([]);
      setSelectedDrones([]);
    }


  return (
    <>
      <DroneItemSelection
        completeNode={completeNode} 
        addDrone={addDrone} 
        options={allDrones?.filter(x => !selectedDrones?.includes(x.nodeName))}></DroneItemSelection>
    {mappedDrones?.map(drone=><div key={drone}><DroneItem  allDrones={allDrones} drone={drone} removeDrone={removeDrone}></DroneItem></div>)}
    </>
  )
}
