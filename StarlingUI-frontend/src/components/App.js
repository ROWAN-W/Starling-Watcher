import React, {useState, useEffect} from "react";
import User from "./user/User";
import { v4 as uuidv4 } from 'uuid';
import '../css/app.css';
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Deployment from "./Deployment";
import Monitor from "./Monitor";
import useFetch from "./useFetch";

export const ProjectContext = React.createContext();

function App() {

  const [currentUserID, setCurrentUserID] = useState();
  const [selectedProjectID, setSelectedProjectID] = useState();
  const [projects, setProjects] = useState([]);
  const [userSignIn, setUserSignIn] = useState(false);

  const [deployedProjectID, setDeployedProjectID] = useState();

  const { error: userError, isPending: userPending , data: users } = useFetch('http://localhost:8001/sampleUser',[currentUserID]);
  const { error: projectError, isPending: projectPending , data:projectsData } = useFetch('http://localhost:8000/sampleProject',[currentUserID])
  
  const [images, setImages] = useState([]);

  useEffect(()=>{
    console.log("run when current user changes");
    signInPage();
    //local storage can only store string
    //localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(projects));
  },[currentUserID]);
  //empty: run every render; []: run first render; [...]: run when ... changes

  function signInPage(){
    if(users && projectsData){
      //user sign out
      if(currentUserID===undefined){
        setUserSignIn(true);
      }
    } 
  }

  function handleProjectListChange(userId){
    console.log("project list change");
    if(userId!==undefined){
      console.log("based on the user");
      const userProjects = projectsData.filter(project=>project.memberIDs.find(id=>id===userId));
      console.log(userProjects);
      setProjects(userProjects);
    }else{
      console.log("no user");
      setProjects([]);
    }
  }

  function handleProjectSelect(id){
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

  function handleCurrentUser(name){ //handle user select
    if(name===undefined){
      console.log("user sign out!");
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

  //temporary solution. should be replaced with the operations from the backend
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
    setImages(imagesFromDockerHub);
  }

  function handleDeployedProject(projectID){
    setDeployedProjectID(projectID);
  }

  const projectContextValue = {
    currentUserID,
    projects,
    users,
    images,
    setProjects,
    setSelectedProjectID,
    signInPage,
    handleProjectSelect,
    handleCurrentUser,
    handleUserAdd,
    handleUserChange,
    handleProjectChange,
    handleImageListChange,
    handleDeployedProject
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
        <Deployment currentUserID={currentUserID} selectedProject={projects?.find(project => project.id === selectedProjectID)}></Deployment>
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
