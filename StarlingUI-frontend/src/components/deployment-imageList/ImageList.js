import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../App';
import DockerLogin from './DockerLogin';
import Image from './Image';
import SearchBox from './ImageSearchBox';

export default function ImageList() {

  const { images, setImages} = useContext(ProjectContext);

  const [userSignIn, setUserSignIn] = useState(false); //login window
  const [showSwitchButton, setSwitchButton] = useState(true); //switch button

  const [finalUserName, setFinalUserName] = useState("charaznablegundam");
  const [finalPassword, setFinalPassword] = useState("362514hao");

    const [imageError, setError] = useState(null);
    const [waiting, setWaiting] = useState(true);

  const [searchResult, setSearchResult] = useState([...images]);
  const [searchImage, setSearchImage] = useState('');
    
  useEffect(() => {
    if(waiting===true){
      const url = "http://localhost:8080/design/images";
        
      const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            username: finalUserName,
            password: finalPassword,
        }),
        };
        
        fetch(url,options)
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error('Login Failure. Error Details: '+res.status);
          } 
          return res.json();
        })
        .then(data => {
          setWaiting(false);
          setImages(data);
          setError(null);
          console.log("fetch "+url);
        })
        .catch(err => {
          // auto catches network / connection error
          setWaiting(false);
          setError(err.message);
        })
    }  
    },[finalUserName,finalPassword])


  function showInstruction(){
    if(images.length!==0 && showSwitchButton){
      return(
        <button onClick={()=>{
          setUserSignIn(true); 
          setSwitchButton(false);
          setImages([]); 
          setFinalUserName(''); setFinalPassword('')}}>Log out</button>
      )    
    }
  }

  function finalLogin(username, password){
    setFinalUserName(username);
    setFinalPassword(password);
    setWaiting(true);
  }

  function loginWindow(trigger){
    return(
      <div>
            <DockerLogin trigger={trigger} setTrigger={setUserSignIn} 
            setSwitchButton={setSwitchButton} 
            finalLogin={finalLogin}
            waiting={waiting}
            setWaiting={setWaiting}
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

  function show(){
    if(waiting){
      return <div>Please wait...</div>
    }
    else{
      if(imageError && !userSignIn){
        return (
          <>
            <div>{imageError}</div> 
            <div><button onClick={()=>{setUserSignIn(true);setFinalUserName('');setFinalPassword('')}}>Try again</button></div>
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
            <SearchBox handleImageSearch={handleImageSearch}/>
            {searchImage===''? 
            images.map(image=>{
                return <Image key={image.id} {...image}></Image>
            }):
            searchResult.map(image=>{
                return <Image key={image.id} {...image}></Image>
            })}
            </>
          )
        }
      }
    }
  }

    return (
    <>
      <div className='image-tag-container'>
      {show()}
      </div>
    </>
  )
}