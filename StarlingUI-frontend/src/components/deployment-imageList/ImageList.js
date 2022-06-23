import React, {useState, useContext, useEffect} from 'react';
import { ProjectContext } from '../App';
import DockerLogin from './DockerLogin';
import Image from './Image';
import SearchBox from './ImageSearchBox';

export default function ImageList() {

  const { images, handleImageListChange} = useContext(ProjectContext);

  const [userSignIn, setUserSignIn] = useState(false); //login window
  const [showSwitchButton, setSwitchButton] = useState(true); //switch button

  const [finalUserName, setFinalUserName] = useState("charaznablegundam");
  const [finalPassword, setFinalPassword] = useState("362514hao");

    const [imagesData, setData] = useState(null);
    const [imagePending, setIsPending] = useState(true);
    const [imageError, setError] = useState(null);
    const [waiting, setWaiting] = useState(false);

  const [searchResult, setSearchResult] = useState([...images]);
  const [searchImage, setSearchImage] = useState('');
    
  useEffect(() => {
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
          setIsPending(false);
          setData(data);
          setError(null);
          console.log("fetch "+url);
          handleImageListChange(data);
        })
        .catch(err => {
          // auto catches network / connection error
          setIsPending(false);
          setError(err.message);
        })
      
    },[finalUserName,finalPassword])


  function showInstruction(){
    if(images.length!==0 && showSwitchButton){
      return(
        <button onClick={()=>{setUserSignIn(true); setSwitchButton(false);handleImageListChange([]);}}>Switch docker hub account</button>
      )    
    }
  }

  function finalLogin(username, password){
    if(username===finalUserName && password===finalPassword){
      console.log("same account");
      if(imagesData!=null){
        handleImageListChange(imagesData);
      }else{
        console.log("same failure");
        handleImageListChange([]);
      }
    }
    else{
      console.log("different account need reload");
      setFinalUserName(username);
      setFinalPassword(password);
    }
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
    if(imagePending){
      return <div>Loading...</div>
    }
    else{
      if(imageError && !userSignIn){
        return (
          <>
            <div>{imageError}</div> 
            <div><button onClick={()=>{setUserSignIn(true)}}>Try again</button></div>
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
        if(!imageError&& !waiting && images){
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

/**
 * <>
      <div className='image-tag-container'>
      {imagePending&& <div>Loading...</div> }
      
      {imageError && !userSignIn &&
      <div>
        {imageError} 
        <div><button onClick={()=>{setUserSignIn(true)}}>Try again</button></div>
      </div>}
      
      <>
      {!userSignIn && showInstruction()}
      {loginWindow(userSignIn)}
      </>
      
      { !imageError&& !waiting && !imagePending&&
        <>
        {!userSignIn && <SearchBox handleImageSearch={handleImageSearch}/>}
        {searchImage===''? 
        images.map(image=>{
            return <Image key={image.id} {...image}></Image>
        }):
        searchResult.map(image=>{
          return <Image key={image.id} {...image}></Image>
        })}
        </>
      }
      </div>
    </>
 */