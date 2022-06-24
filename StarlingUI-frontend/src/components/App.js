import React, {useState, useEffect} from "react";
import User from "./user/User";
import { v4 as uuidv4 } from 'uuid';
import '../css/app.css';
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { useHistory, useParams } from "react-router-dom";
import Deployment from "./Deployment";
import Monitor from "./Monitor";
import useFetch from "./useFetch";

export const ProjectContext = React.createContext();

function App() {

  const [currentUserID, setCurrentUserID] = useState();
  const [selectedProjectID, setSelectedProjectID] = useState();
  const [projects, setProjects] = useState();
  const [userSignIn, setUserSignIn] = useState(false);

  const [deployedProjectID, setDeployedProjectID] = useState();

  const { error: userError, isPending: userPending , data: users } = useFetch('http://localhost:8001/sampleUser',[currentUserID]);
  const { error: projectError, isPending: projectPending , data:projectsData } = useFetch('http://localhost:8000/sampleProject',[currentUserID])
  
  const [images, setImages] = useState([]);

  //const history = useHistory();
  
  useEffect(()=>{
    console.log("run every render can fetch data");
    signInPage();
    //local storage can only store string
    //localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(recipes));
  },[users, projectsData]);
  //empty: run every render; []: run first render; [...]: run when ... changes

  function handleProjectListChange(userId){
    console.log("project list change");
    if(userId!==undefined){
      console.log("based on the user");
      console.log(projectsData);
      const userProjects = projectsData.filter(project=>project.memberIDs.find(id=>id===userId));
      console.log(userProjects);
      setProjects(userProjects);
    }else{
      console.log("no user");
      setProjects([]);
    }
  }

  function handleProjectAdd(){
    if(currentUserID!==undefined){
      const masterId = uuidv4();

      const newProject = {
      id: uuidv4(),
      name: 'new project',
      dateModified: new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString(),
      lastModifiedBy: currentUserID,
      saved: false,
      ownerID: currentUserID,
      memberIDs: [currentUserID],
      config:[
        {
          id:masterId,
          name: 'new design',
          kind: 'master',
          label: 
            {
              app: 'starling',
              platform: 'pixhawk'
            }
          ,
          containers:[]    
        },
      ],
      mapping:[
        {
          nodeID: masterId,
          mappedDrones: []
        }
      ]
    }
    console.log("add project!");
    postToServer('http://localhost:8000/sampleProject',newProject);
    setProjects([...projects,newProject]);
    setSelectedProjectID(newProject.id);
    }
  }

  function handleProjectDelete(id){
    console.log("delete project!");
    if(selectedProjectID!==null && selectedProjectID === id){
      setSelectedProjectID(undefined);
    }
    setProjects(projects.filter(project=>project.id!==id));
    fetch('http://localhost:8000/sampleProject/' + id, {
      method: 'DELETE'
    }).then(() => {
      //history.push('/');
    })
  }

  function handleProjectSelect(id){
    console.log("select project! "+id);
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
    if(selectedProjectID!==undefined){
      console.log("update before you go");
      const updatedProject = projects.find(p=>p.id===selectedProjectID);
      saveProjectToServer(updatedProject);
    }
  }
  
//when change project and change account
  function saveProjectToServer(updatedProject){
    if(updatedProject.saved===false){
      updatedProject.saved=true;
      let today = new Date();
      updatedProject.dateModified = today.toLocaleDateString()+' '+today.toLocaleTimeString();
      updatedProject.lastModifiedBy = currentUserID;
      const index = projectsData.findIndex(p=>p.id===selectedProjectID);
      if(index!==-1){
        console.log("existing project");
        putToServer('http://localhost:8000/sampleProject',updatedProject.id,updatedProject);
      }else{
        console.log("new project");
        postToServer('http://localhost:8000/sampleProject',updatedProject);
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
      setSelectedProjectID(undefined);
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
    const newUser = {id: uuidv4(), name: newUserName, password: newPassword};
    console.log('new user added');
    postToServer('http://localhost:8001/sampleUser',newUser);
    setCurrentUserID(newUser.id);
  }

  function handleUserChange(id, user){
    console.log('user info change');
    putToServer('http://localhost:8001/sampleUser',id,user);
  }

  function postToServer(url,data){
    fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('info added');
    })
  }

  function putToServer(url,id,data){
    fetch(url+'/'+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('info change');
    })
  }

  function handleImageListChange(imagesFromDockerHub){
    console.log("load images from docker hub")
    setImages(imagesFromDockerHub);
  }

  function handleDeployedProject(projectID){
    setDeployedProjectID(projectID);
  }

  const projectContextValue = {
    currentUserID,
    users,
    projects,
    projectsData,
    images,
    signInPage,
    handleProjectSelect,
    handleCurrentUser,
    handleUserAdd,
    handleUserChange,
    handleProjectChange,
    handleProjectDelete,
    handleProjectAdd,
    handleProjectListChange,
    handleImageListChange,
    handleDeployedProject
  }

  function signInPage(){
    console.log(users);
    console.log(projectsData);
    if(users && projectsData){
      if(currentUserID===undefined){
        setUserSignIn(true);
      }
    } 
  }

  
  
  return (
    <Router>
    <ProjectContext.Provider value={projectContextValue}>
    <div className="top-bar">
    <Navbar></Navbar>
    <User userSignIn={userSignIn} setUserSignIn={setUserSignIn} currentUser={users?.find(user => user.id === currentUserID)}></User>
    </div>
    { (userError || projectError ) && <div className="message">{ userError }</div> }
    { (userPending || projectPending ) && <div className="message">Loading...</div> }
    { (users && projectsData ) &&
    <Switch>
      <Route exact path="/">
        <Deployment currentUserID={currentUserID} selectedProject={projects?.find(project => project.id === selectedProjectID)} updateProjectToData={updateProjectToData} handleProjectAdd={handleProjectAdd} handleProjectDelete={handleProjectDelete}></Deployment>
      </Route>
      <Route path="/monitor">
        <Monitor deployedProjectID={deployedProjectID}></Monitor>
      </Route>
    </Switch>
    }
    </ProjectContext.Provider>
    </Router>
  )
}

export default App;
