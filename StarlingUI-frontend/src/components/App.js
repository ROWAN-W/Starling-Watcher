import React, {useState, useEffect, useCallback} from "react";
import '../css/app.css';
import Navbar from "./Navbar";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Deployment from "./Deployment";
import Monitor from "./Monitor";
import useFetch from "./useFetch";
import ContainerTerminal from "./monitor-contianer/ContainerTerminal";
import ContainerLogs from "./monitor-contianer/ContainerLogs";

const LOCAL_STORAGE_KEY_USER = 'Starling.user';
const LOCAL_STORAGE_KEY = 'Starling.user.projects';

export const ProjectContext = React.createContext();

function App() {

    const [userData, setUserData] = useState();

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

    const {
        error: userError,
        isPending: userPending,
        data: users
    } = useFetch('http://localhost:8080/design/users', [], setUserData);
    const {
        error: projectError,
        isPending: projectPending,
        data: projectsData
    } = useFetch('http://localhost:8080/design/projects', [currentUserID], null)

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


    useEffect(() => {
        console.log("run when current user changes");
        signInPage();
    }, [currentUserID]);

    function signInPage() {
        if (currentUserID === '') {
            setUserSignIn(true);
        }
    }

    function handleProjectListChange(userId) {
        console.log("project list change");
        if (userId !== undefined) {
            console.log("based on the user");
            const userProjects = projectsData.filter(project => project.memberIDs.find(id => id === userId));
            console.log(projectsData);
            console.log(userProjects);
            setProjects(userProjects);
        } else {
            console.log("no user");
            setProjects([]);
        }
    }

    function handleProjectSelect(id) {
        setSelectedProjectID(id);
    }

    function handleProjectChange(id, project) {
        console.log("project content change")
        console.log(project);
        project.saved = false;
        const newProjects = [...projects];
        const index = newProjects.findIndex(r => r.id === id);
        newProjects[index] = project;
        setProjects(newProjects);
    }

    function handleCurrentUser(id) { //handle user select
        if (id === undefined) {
            console.log("user sign out!");
            //test
            setCurrentUserID('');
            setSelectedProjectID(undefined);
            handleProjectListChange(undefined);
        } else {
            console.log("user sign in!");
            console.log(userData);
            setCurrentUserID(id);
            handleProjectListChange(id);
        }
    }

    function handleUserAdd(id, name) {
        const newUser = {id: id, name: name};
        console.log(newUser);
        setUserData([...userData, newUser]);
        setCurrentUserID(id);
    }

    const projectContextValue = {
        currentUserID,
        projects,
        userData,
        images,
        userSignIn,
        setUserSignIn,
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

                {(userError || projectError) &&
                    <div className="project-title">{userError ? userError : projectError}</div>}
                {(userPending || projectPending) && <div className="project-title">Loading...</div>}
                {(users && projectsData) &&
                    <Switch>
                        <Route exact path="/">
                            <Navbar></Navbar>
                            <Deployment
                                selectedProject={projects?.find(project => project.id === selectedProjectID)}></Deployment>
                        </Route>
                        <Route path="/monitor">
                            <Navbar></Navbar>
                            <Monitor></Monitor>
                        </Route>


                    </Switch>
                }
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
