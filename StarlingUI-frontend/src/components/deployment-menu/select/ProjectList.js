import React,{useState, useEffect, useContext} from 'react';
import { ProjectContext } from '../../App';
import ProjectSearchBox from './ProjectSearchBox';
import SearchType from './SearchType';

export default function ProjectList(props) {
    
    const {userData, projects, handleProjectSelect} = useContext(ProjectContext);

    const [data, setData] = useState();
    const [order, setOrder] = useState("ASC"); 
    const [orderCol, setOrderCol] = useState(); 

    const [searchType, setSearchType] = useState('name');
    const [searchProject, setSearchProject] = useState('');

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

    function showResult(){
        if(searchProject===''){
            return data;
        }
        else{
            return data.filter(i=>i[searchType].toLowerCase().includes(searchProject.toLowerCase())); 
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
        <div className='project-list-search'>
        <SearchType searchType={searchType} setSearchType={setSearchType}></SearchType>
        <ProjectSearchBox setSearchProject={setSearchProject} searchProject={searchProject}></ProjectSearchBox>
        </div>
            <table className="fl-table wordwrap">
            <thead>
            <tr>
                <th onClick={()=>{sorting("id");setOrderCol("id")}}>ID{showIcon("id")}</th>
                <th onClick={()=>{sorting("name");setOrderCol("name")}}>Project Name {showIcon("name")}</th>
                <th onClick={()=>{sorting("dateModified");setOrderCol("dateModified")}}>Last Saved {showIcon("dateModified")}</th>
                <th title="sort by ID" onClick={()=>{sorting("lastModifiedBy");setOrderCol("lastModifiedBy")}}>Last Saved by{showIcon("lastModifiedBy")}</th>
            </tr>
            </thead>
            <tbody>
            {showResult()?.map(project=>{
                return(
                    <tr 
                        key={project.id} 
                        onClick={()=>{handleProjectSelect(project.id); props.setTrigger(false)}}>
                        <td title={project.id}>{project.id.slice(-4)}</td>
                        <td>{project.name}</td>
                        <td>{project.dateModified}</td>
                        <td title={project.lastModifiedBy}>{userData.find(user=>user.id===project.lastModifiedBy)?.name}<span className='user-id'>(ID:{project.lastModifiedBy.slice(-2)})</span></td>
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
