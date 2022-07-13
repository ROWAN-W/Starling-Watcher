import React,{useState, useEffect, useContext} from 'react';
import { ProjectContext } from '../App';

export default function ProjectList(props) {
    
    const {userData, projects, handleProjectSelect} = useContext(ProjectContext);

    const [data, setData] = useState();
    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState(); 

    useEffect(() => {
        if(props.trigger===true){
            setData(projects);
        }
    },[props.trigger])

    function sorting(col){
        if(order==="ASC"){
            console.log("ASC");
            const sorted = [...data].sort((a,b)=>
            a[col].toLowerCase() > b[col].toLowerCase() ? 1: -1);
            setData(sorted);
            setOrder("DSC");
        }else if(order==="DSC"){
            console.log("DSC");
            const sorted = [...data].sort((a,b)=>
            a[col].toLowerCase() < b[col].toLowerCase() ? 1: -1);
            setData(sorted);
            setOrder("ASC");
        }
    }

    function showIcon(col){
        if(col===orderCol){
            return <span className='drone-sort-icon'>↑↓</span>
        }
    }

    return (props.trigger) ? (
    <div className='popup-projects'>
        <div className='popup-projects-inner'>
        <div className='popup-header table'>
            <span className='popup-title'>Your Project List</span>
            <button className='popup-close-button' onClick={()=>{props.setTrigger(false);setOrderCol()}}>&times;</button>
        </div>
        <div className="table-wrapper">
            <table className="fl-table">
            <thead>
            <tr>
                <th onClick={()=>{sorting("name");setOrderCol("name")}}>Project Name {showIcon("name")}</th>
                <th onClick={()=>{sorting("dateModified");setOrderCol("dateModified")}}>Last Saved {showIcon("dateModified")}</th>
                <th onClick={()=>{sorting("lastModifiedBy");setOrderCol("lastModifiedBy")}}>Last Saved by(ID) {showIcon("lastModifiedBy")}</th>
            </tr>
            </thead>
            <tbody>
            {data?.map(project=>{
                return(
                    <tr 
                        key={project.id} 
                        onClick={()=>{handleProjectSelect(project.id); props.setTrigger(false)}}>
                        <td>{project.name}</td>
                        <td>{project.dateModified}</td>
                        <td>{userData.find(user=>user.id===project.lastModifiedBy).name}</td>
                    </tr>
                ) 
            })}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  ): ""
}
