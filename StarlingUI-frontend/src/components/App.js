import React, {useState, useEffect} from "react";
import User from "./user/User";
import { v4 as uuidv4 } from 'uuid';
import '../css/app.css';
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Deployment from "./Deployment";
import Monitor from "./Monitor";
import useFetch from "./useFetch";

const LOCAL_STORAGE_KEY_USER = 'Starling.user';
const LOCAL_STORAGE_KEY = 'Starling.user.projects';

export const ProjectContext = React.createContext();

function App() {

  const [currentUserID, setCurrentUserID] = useState(''); //undefined -> ''
  /*const [currentUserID, setCurrentUserID] = useState(() => { 
    //load/get from storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER)
    if (saved == null) {
      return ''
    } else {
      return JSON.parse(saved)
    }
  })*/

  const [selectedProjectID, setSelectedProjectID] = useState();
  
  const [projects, setProjects] = useState([]);
  /*const [projects, setProjects] = useState(() => { 
    //load/get from storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved == null) {
      return []
    } else {
      return JSON.parse(saved)
    }
  })*/
  
  const [userSignIn, setUserSignIn] = useState(false);

  const { error: userError, isPending: userPending , data: users } = useFetch('http://localhost:8001/sampleUser',[currentUserID]);
  const { error: projectError, isPending: projectPending , data:projectsData } = useFetch('http://localhost:8000/sampleProject',[currentUserID])
  
  const [images, setImages] = useState([]);

  /*useEffect(()=>{
    console.log("run when current user changes and store to storage");
    localStorage.setItem(LOCAL_STORAGE_KEY_USER,JSON.stringify(currentUserID));
    signInPage();
  },[currentUserID]);
  //empty: run every render; []: run first render; [...]: run when ... changes

  useEffect(()=>{
    console.log("run when project content changes and store to storage");
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(projects));
  },[projects]);*/

  useEffect(()=>{
    console.log("run when current user changes");
    signInPage();
  },[currentUserID]);

  function signInPage(){
    if(users && projectsData){
      //user sign out
      //test
      if(currentUserID===''){
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
      //test
      setCurrentUserID('');
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
      setCurrentUserID(data.id);
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

  const projectContextValue = {
    currentUserID,
    projects,
    users,
    images,
    setImages,
    setProjects,
    signInPage,
    handleProjectSelect,
    handleCurrentUser,
    handleUserAdd,
    handleUserChange,
    handleProjectChange
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
        <Deployment selectedProject={projects?.find(project => project.id === selectedProjectID)}></Deployment>
      </Route>
      <Route path="/monitor">
        <Monitor></Monitor>
      </Route>
    </Switch>
    }
    </ProjectContext.Provider>
    </Router>
  )
}

export default App;
