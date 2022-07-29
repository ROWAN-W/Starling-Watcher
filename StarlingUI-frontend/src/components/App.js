import React, {useState, useEffect, useCallback} from "react";
import { useCookies } from "react-cookie";
import { getCookie } from 'react-use-cookie'
import '../css/app.css';
import Navbar from "./Navbar";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Deployment from "./Deployment";
import Monitor from "./Monitor";
import ContainerTerminal from "./monitor-contianer/ContainerTerminal";
import ContainerLogs from "./monitor-contianer/ContainerLogs";
import RecoverMessage from "./RecoverMessage";
import axios from "axios";
const PROJECT_URL = 'http://localhost:8080/design/projects';
const USER_URL = 'http://localhost:8080/design/users';
const REFRESH_URL = 'http://localhost:8080/refresh';


const LOCAL_STORAGE_KEY = 'Starling.user.projects';

export const ProjectContext = React.createContext();

function App() {

  const [cookies, setCookie, removeCookie] = useCookies();

  const [currentUserID, setCurrentUserID] = useState(''); //undefined -> ''

  const [selectedProjectID, setSelectedProjectID] = useState();
  
  //const [projects, setProjects] = useState([]);
  const [projects, setProjects] = useState(() => { 
    //load/get from storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved == null) {
      return []
    } else {
      return JSON.parse(saved)
    }
  })
  
  const [userSignIn, setUserSignIn] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [userData, setUserData] = useState(null);
  const [projectsData, setProjectData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const [images, setImages] = useState([]);

  const [unsavedProjectIDs, setUnsavedProjectIDs] = useState([]);
  const [recoverMessage, setRecoverMessage] = useState(true);

  useEffect(()=>{
    const refreshToken = getCookie('refreshToken');
    const user = getCookie('user');
    if(refreshToken!=='' && user!==''){ //remember me
        console.log("auto sign in check with "+refreshToken);
        (async () => {
          try {
              const {data} = await axios.get(REFRESH_URL,
                {
                  headers: { 
                      'Authorization': `Bearer ${refreshToken}` ,
                  },
                });
                setCurrentUserID(getCookie('user'));
                axios.defaults.headers.common['Authorization'] = `Bearer ${data['accessToken']}`;
                console.log("success auto sign in");
          } catch (err) {
            handleCurrentUser(undefined);
            console.log("refresh token expires. log out.");
            signInPage();
          }
      })();
    }

  },[]);
  
  useEffect(()=>{
    console.log("run when current user changes");
    signInPage();

    if(currentUserID!=='' && projects.length===0){
      const requestOne = axios.get(USER_URL);
      const requestTwo = axios.get(PROJECT_URL);
      console.log("fetch two api");
      
        axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
          const responseOne = responses[0].data;
          const responseTwo = responses[1].data;
          setIsPending(false);
          setUserData(responseOne);
          setProjectData(responseTwo);
          setError(null);
          console.log(responseOne);
          console.log(responseTwo);
          console.log("fetch: "+USER_URL+" and "+PROJECT_URL);
          setProjects(responseTwo.filter(project=>project.memberIDs.find(id=>id===currentUserID)));
        })).catch(err => {
          setIsPending(false);
          console.log(err);
          if(err.response.status===401){
            setError("Authentication is required. Please sign in again.");
            handleCurrentUser(undefined);
          }else{
            setError(err.message);
          }
        })  
    }else if(currentUserID!=='' && projects.length!==0){
        console.log("fetch one api");
        axios.get(USER_URL).then(responses => {
        const responseOne = responses.data;
        setIsPending(false);
        setUserData(responseOne);
        setError(null);
        //remind user
        checkUnsavedProjects();
        console.log(responseOne);
        console.log("fetch: "+USER_URL);
      }).catch(err => {
        setIsPending(false);
        console.log(err);
        if(err.response.status===401){
          setError("Authentication is required. Please sign in again.");
          handleCurrentUser(undefined);
        }else{
          setError(err.message);
        }
      })  
    }
    
  },[currentUserID]);

  useEffect(()=>{
    if(rememberMe){
      console.log("store project in local storage");
      //local storage can only store string
      localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(projects));
    }
  },[projects]);

  function signInPage(){
    if(currentUserID==='' && getCookie('user')===''){
      console.log("sign in page");
      setUserSignIn(true);
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

  function handleCurrentUser(id){ //handle user select
    if(id===undefined){
      console.log("user sign out!");
      setCurrentUserID('');
      removeCookie("refreshToken");
      removeCookie("user");
      localStorage.clear();
      setSelectedProjectID(undefined);
      setProjects([]);
    }else{
      console.log("user sign in!");
      setCurrentUserID(id);
      if(rememberMe){
        setCookie("user", id, { path: '/' });
      }
    }
  }

  function handleUserAdd(id, name){
    const newUser = {id: id, name: name};
    console.log(newUser);
    setUserData([...userData, newUser]);
    setCurrentUserID(id);
  }

  function checkUnsavedProjects(){
    let unsavedArray=[];
    for(let i=0;i<projects.length;i++){
        if(projects[i].memberIDs.includes(currentUserID) && projects[i].saved===false){
          console.log("unsaved project: "+projects[i].id);
          unsavedArray = [...unsavedArray, projects[i].id];
        }
    }
    setUnsavedProjectIDs(unsavedArray);
  }

  const projectContextValue = {
    currentUserID,
    projects,
    userData,
    images,
    userSignIn,
    setUserSignIn,
    setRememberMe,
    setUserData,
    setImages,
    setProjects,
    signInPage,
    handleProjectSelect,
    handleCurrentUser,
    handleUserAdd,
    handleProjectChange
  } 
  
  return (
        <Router>
            <ProjectContext.Provider value={projectContextValue}>
                    <Switch>
                        <Route exact path="/">
                            <Navbar></Navbar>
                            { (error) && <div className="project-title">{error}</div> }
                            { currentUserID!=='' && (isPending) && <div className="project-title">Loading...</div> }
                            { (userData || projectsData ) &&
                            <Deployment 
                              selectedProject={projects?.find(project => project.id === selectedProjectID)}></Deployment>}
                            {(userData || projectsData ) && unsavedProjectIDs.length!==0 && <RecoverMessage trigger={recoverMessage} setTrigger={setRecoverMessage} unsavedProjectIDs={unsavedProjectIDs}></RecoverMessage>}  
                        </Route>
                        <Route path="/monitor">
                            <Navbar></Navbar>
                            <Monitor></Monitor>
                        </Route>
                    </Switch>
            </ProjectContext.Provider>

            <Route path="/terminal/:name/:namespace/:container">
                <ContainerTerminal></ContainerTerminal>
            </Route>
            <Route path="/logs/:name/:namespace/:container">
                <ContainerLogs></ContainerLogs>
            </Route>
        </Router>
    )
}

export default App;
