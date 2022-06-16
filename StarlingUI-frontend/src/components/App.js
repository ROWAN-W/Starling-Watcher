import React, {useState, useEffect} from "react";
import Menu from "./Menu";
import Project from "./Project";
import User from "./User";
import { v4 as uuidv4 } from 'uuid';
import '../css/app.css';
import ImageList from "./ImageList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroneList from "./DroneList";

export const ProjectContext = React.createContext();

function App() {
  
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState(sampleUsers);
  const [images, setImages] = useState([]);
  const [droneListTrigger,setDroneListTrigger] = useState(true);
  
  const [selectedProjectID, setSelectedProjectID] = useState();
  const selectedProject = projects.find(project => project.id === selectedProjectID);
  
  const [currentUserID, setCurrentUserID] = useState();
  const currentUser = users.find(user => user.id === currentUserID);

  useEffect(()=>{
    console.log("rendered");
    //local storage can only store string
    //localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(recipes));
  },[projects, users]);

  function handleProjectListChange(userId){
    console.log("project list change");
    if(userId!==undefined){
      console.log("based on the user");
      const userProjects = sampleProjects.filter(project=>project.memberIDs.find(id=>id===userId));
      console.log(userProjects);
      setProjects(userProjects);
    }else{
      console.log("no user");
      setProjects([]);
    }
  }

  function handleProjectAdd(){
    if(currentUserID!==undefined){
      const newProject = {
      id: uuidv4(),
      name: 'new project',
      dateModified: new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString(),
      lastModifiedBy: currentUserID,
      saved: false,
      ownerID: currentUserID,
      memberIDs: [currentUserID],
      masterNode: {
      id: uuidv4(),
      name: 'master',
      images:[],
      deployedDrones:[]
      },
      workingNodes:[
        {
          id:uuidv4(),
          name: 'node',
          images:[],
          deployedDrones:[]
        }
      ]
    }
    console.log("add project!");
    setProjects([...projects,newProject]);
    setSelectedProjectID(newProject.id);
    }
  }

  function handleProjectDelete(id){
    console.log("delete project!");
    if(selectedProjectID!=null && selectedProjectID === id){
      setSelectedProjectID(undefined);
    }
    setProjects(projects.filter(project=>project.id!==id));
  }

  function handleProjectSelect(id){
    console.log("select project!");
    
    updateProjectToData();

    setSelectedProjectID(id);
  }

  function handleProjectChange(id, project){
    console.log("project content change")
    console.log(project);
    project.saved = false;
    const newProjects = [...projects]; 
    const index = newProjects.findIndex(r=>r.id === id);
    newProjects[index] = project;
    setProjects(newProjects);
  }

  function updateProjectToData(){
    if(selectedProject!==undefined){
      console.log("update before you go");
      const updatedProject = projects.find(p=>p.id===selectedProjectID);
      console.log(updatedProject);
      //console.log(sampleProjects);
      saveToServer(updatedProject);
    }
  }
  
//change project and change account
  function saveToServer(updatedProject){
    if(updatedProject.saved===false){
      console.log("update to server...coding needed");
      updatedProject.saved=true;
      let today = new Date();
      updatedProject.dateModified = today.toLocaleDateString()+' '+today.toLocaleTimeString();
      updatedProject.lastModifiedBy = currentUserID;
      const index = sampleProjects.findIndex(p=>p.id===selectedProjectID);
      if(index!==-1){
        console.log("existing project");
        sampleProjects[index] = updatedProject;
      }else{
        console.log("new project");
        sampleProjects = [...sampleProjects,updatedProject]
      }
    }else{
      console.log("already saved");
    }
  }

  function handleCurrentUser(name){ //handle user select
    if(name===undefined){
      console.log("user sign out!");

      updateProjectToData();

      setCurrentUserID(undefined);
      handleProjectListChange(undefined);
    }else{
      console.log("user sign in!");
      console.log(users);
      const id = users.find(user => user.name === name).id;
      console.log(id);
      setCurrentUserID(id);
      handleProjectListChange(id);
    }
  }

  function handleUserAdd(newUserName, newPassword){
    const newUser = {
      id: uuidv4(),
      name: newUserName,
      password: newPassword,

    }
    console.log("add user!");
    setUsers([...users,newUser]);
    setCurrentUserID(newUser.id);
    console.log(newUser.name);
    console.log(newUser.password);
  }

  function handleUserChange(id, user){
    const newUsers = [...users]; 
    const index = newUsers.findIndex(u=>u.id === id);
    newUsers[index] = user;
    setUsers(newUsers);
    console.log("user info change")
  }

  function handleImageListChange(imagesFromDockerHub){
    console.log("load images from docker hub")
    setImages(imagesFromDockerHub);
  }

  const projectContextValue = {
    currentUserID,
    users,
    projects,
    images,
    handleProjectSelect,
    handleCurrentUser,
    handleUserAdd,
    handleUserChange,
    handleProjectChange,
    handleProjectDelete,
    handleProjectListChange,
    handleImageListChange,
  }

  function handleChange(changes){
    handleProjectChange(selectedProject.id, {...selectedProject,...changes})
  }

  function showProjectTitle(){
    if(selectedProject===undefined){
      return <h1>Project Planning</h1>
    }else{
      return <div><input
      className="project-title"
      value={selectedProject.name}
      onChange={e=>handleChange({name: e.target.value})}></input></div>
    }
  }


  function showDroneList(){
    //two columns
    if(droneListTrigger===false){
      return (
        <div><button onClick={()=>setDroneListTrigger(true)}>Drones</button> </div>       
      ) 
    //three columns //true
    }else{
      return (
        <DroneList drones={sampleDrones} trigger={droneListTrigger} setTrigger={setDroneListTrigger}></DroneList>
      )
    }
  }
  
  return (
    <ProjectContext.Provider value={projectContextValue}>
    <User currentUser={currentUser}></User>
    <div className="header">
    {showProjectTitle()}
    <div className="navbar"><Menu selectedProject={selectedProject} updateProjectToData={updateProjectToData} handleProjectAdd={handleProjectAdd} handleProjectDelete={handleProjectDelete}></Menu></div>
    </div>
    <div className="body">
        <DndProvider backend={HTML5Backend}>
        <ImageList></ImageList>
        <Project currentUser={currentUser} selectedProject={selectedProject} droneListTrigger={droneListTrigger}></Project>
        </DndProvider>
        {showDroneList()}
    </div>
    </ProjectContext.Provider>

  )
}

const sampleUsers=[
  {
    id:1,
    name:'John',
    password: '1234',

  },
  {
    id:2,
    name:'Alice',
    password: '1234',

  },
  {
    id:3,
    name:'Bob',
    password: '5678',

  }
]

const sampleDrones = [
  {
    id: 1,
    name: 'clover7',
    type: 'Master',
    mac: '00:00:5e:00:53:af',
    info: 'What do you want to see here?'

  },
  {
    id: 2,
    name: 'clover2',
    type: 'Worker',
    mac: '00:00:8b:00:53:aa',
    info: 'What do you want to see here?'
  },
  {
    id: 3,
    name: 'clover3',
    type: 'Worker',
    mac: '00:00:3c:00:53:cc',
    info: 'What do you want to see here?'
  },
  {
    id: 4,
    name: 'clover4',
    type: 'Worker',
    mac: '00:00:6b:00:53:ff',
    info: 'What do you want to see here?'
  },
  {
    id: 5,
    name: 'clover5',
    type: 'Worker',
    mac: '00:00:48:00:53:d4',
    info: 'What do you want to see here?'
  },
  {
    id: 6,
    name: 'clover6',
    type: 'Worker',
    mac: '00:00:29:00:53:bb',
    info: 'What do you want to see here?'
  },

]

let sampleProjects = [
  {
    id: 1,
    name: 'Project A',
    dateModified: '2022-06-05 00:00:00',
    lastModifiedBy: 1,
    saved: true,
    ownerID: 1,
    memberIDs: [1],
    masterNode: {
      id: 1000,
      name: 'masterA',
      images:[
        {
          id:1,
          name:'image1'
        }
      ]
      ,
      deployedDrones:[
        {
          id:1,
          name:'drone1'
        }
      ]
    },
    workingNodes:[
      {
        id:1,
        name: 'node1',
        images:[
          {
            id:1,
            name:'image1'
          },
          {
            id:2,
            name:'image2'
          }
        ],
        deployedDrones:[
          {
            id:2,
            name:'drone2'
          },
          {
            id:3,
            name:'drone3'
          },
        ]
      },
      {
        id:2,
        name: 'node2',
        images:[
          {
            id:2,
            name:'image2'
          }
        ],
        deployedDrones:[
          {
            id:2,
            name:'drone2'
          },
          {
            id:3,
            name:'drone3'
          },
        ]
      },
    ]
  },
  {
    id: 2,
    name: 'Project B',
    dateModified: '2022-05-30 00:00:00',
    lastModifiedBy: 1,
    saved: true,
    ownerID: 2,
    memberIDs: [2,1,3],
    masterNode: {
      id: 1000,
      name: 'masterB',
      images:[
        {
          id:2,
          name:'image2'
        }
      ],
      deployedDrones:[
        {
          id:1,
          name:'drone1'
        }
      ]
    },
    workingNodes:[
      {
        id:1,
        name: 'node1',
        images:[
          {
            id:1,
            name:'image1'
          },
          {
            id:2,
            name:'image2'
          }
        ],
        deployedDrones:[
          {
            id:2,
            name:'drone2'
          },
          {
            id:3,
            name:'drone3'
          },
        ]
      },
      {
        id:2,
        name: 'node2',
        images:[
          {
            id:1,
            name:'image1'
          },
          {
            id:2,
            name:'image2'
          },
          {
            id:3,
            name:'image3'
          }
        ],
        deployedDrones:[
          {
            id:4,
            name:'drone4'
          }
        ]
      }
    ]
  }
]


export default App;
