import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../App';
import DockerLogin from './DockerLogin';
import Image from './Image';
import SearchBox from './ImageSearchBox';
import logo from '../../css/img/load.gif';
import ImageSort from './ImageSort';
const IMAGE_URL = 'http://localhost:8080/design/image/';

export default function ImageList() {

  const { images, setImages} = useContext(ProjectContext);

  const [userSignIn, setUserSignIn] = useState(false); //login window

  const [finalRepoName, setFinalRepoName] = useState("uobflightlabstarling");

  const [imageError, setError] = useState(null);
  const [waiting, setWaiting] = useState(true);

  const [searchResult, setSearchResult] = useState([...images]);
  const [searchImage, setSearchImage] = useState('');

  const [order, setOrder] = useState("DSC"); 
  const [orderCol, setOrderCol] = useState("lastUpdated"); 
    
  useEffect(() => {
      //use fetch() to avoid triggering axios interceptor
        const options = {
          method: "GET",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
          }
          };
          
          fetch(IMAGE_URL+finalRepoName,options)
          .then(res => {
            if (!res.ok) { // error coming back from server
              if(res.status===403){
                throw Error("Fail to connect to the repository");
              }
              else if(res.status===404){
                throw Error("Invalid repository name or empty repository");
              }
              throw Error('Error Details: '+res.status);
            } 
            return res.json();
          })
          .then(data => {
            setWaiting(false);
            setImages(data);
            setError(null);
            console.log("fetch "+IMAGE_URL);
          })
          .catch(err => {
            // auto catches network / connection error
            setWaiting(false);
            setImages([]);
            setError(err.message);
          }) 
    },[waiting])


  function showInstruction(){
    if(!waiting){
      return(
        <button className='btn btn-small logout btn-menu' onClick={()=>{
          setUserSignIn(true); 
          }}>Change <br/>Repo</button>
      )    
    }
  }

  function loginWindow(trigger){
    return(
      <div>
            <DockerLogin trigger={trigger} setTrigger={setUserSignIn} 
            setFinalRepoName={setFinalRepoName}
            setError={setError}
            setWaiting={setWaiting}
            setImages={setImages}
            ></DockerLogin>
      </div>
    )
  }

  function handleImageSearch(imageName){
    setSearchResult(images);
    setSearchImage(imageName);
    if(imageName!==''){
      setSearchResult(images.filter(i=>i.name.toLowerCase().includes(imageName.toLowerCase()))); 
      setSearchImage(imageName);
    }
  }

  function tryAgain(){
    setFinalRepoName('');
    setUserSignIn(true);
  }

  function show(){
    if(waiting){
      return <h4 className='wait-message docker'><img className="loading" src={logo} alt="loading..." />Please wait...(3-10 seconds)</h4>
    }
    else{
      if(imageError && !userSignIn){
        return (
          <>
            <div className="error-msg wordwrap"><i className="fa fa-times-circle"></i>{imageError}
            <p onClick={()=>tryAgain()} 
            className='docker-try-again'>Click here to try again</p></div>
          </>
        )
      }
      else if(userSignIn){
        return (
          <>
            {loginWindow(userSignIn)}
          </>
        )
      }
      else if(!userSignIn){
        if(images){
          return(
            <>
            {showInstruction()}
            <div className='node-search-filter image'>
              <><SearchBox handleImageSearch={handleImageSearch}/>
              <ImageSort setSortValue={setOrderCol} setOrder={setOrder}></ImageSort></>
            </div>
            <div className='total-image-number'>Total: {images.length}</div>
            <div className="items-body">  
            {showResult().map(image=>{
                return <Image key={image.id} {...image}></Image>
            })}
            </div>
            </>
          )
        }
      }
    }
  }

  function showResult(){
    if(searchImage===''){
      if(order==="ASC"){
        const sorted = [...images].sort((a,b)=>
        a[orderCol].toLowerCase() > b[orderCol].toLowerCase() ? 1: -1);
        return sorted;
      }else if(order==="DSC"){
        const sorted = [...images].sort((a,b)=>
        a[orderCol].toLowerCase() < b[orderCol].toLowerCase() ? 1: -1);
        return sorted;
      }
    }
    else{
      if(order==="ASC"){
        const sorted = [...searchResult].sort((a,b)=>
        a[orderCol].toLowerCase() > b[orderCol].toLowerCase() ? 1: -1);
        return sorted;
      }else if(order==="DSC"){
        const sorted = [...searchResult].sort((a,b)=>
        a[orderCol].toLowerCase() < b[orderCol].toLowerCase() ? 1: -1);
        return sorted;
      }
    }
  }

    return (
    <>
      <div className='image-tag-container items'>
      <div className="items-head">
      <h2>Docker Hub Images</h2>
      <hr/>
      </div>
      {show()}
      </div>
    </>
  )
}