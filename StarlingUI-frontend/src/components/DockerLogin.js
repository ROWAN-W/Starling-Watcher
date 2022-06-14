import React, {useState, useContext} from 'react'
import { ProjectContext } from './App';

export default function DockerLogin(props) {

    const {handleImageListChange} = useContext(ProjectContext);

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    //0 is neutral, 1 is valid, -1 is invalid
    const [valid, setValid] = useState(0);

    function checkValid(){
        console.log(userName);
        console.log(password);

        const dockerAccount = sampleDockerAccounts.find(element => element.userName===userName && element.password===password);

        if(dockerAccount===undefined){
            console.log("invalid login in");
            setValid(-1);
        }else{
            console.log("login dock hub");
            setValid(1);
            handleImageListChange(dockerAccount.images);
            //clear the account state
            setUserName('');
            setPassword('');
            props.setSwitchButton(true);
            props.setTrigger(false);
        }
    }

    function showInValid(){
        if(valid===-1){
            return(
                <h4>Invalid user name or password!</h4>
            );
        }
    }

  
    return (props.trigger) ?(
        <div className='docker-expand'>
                <h3>Docker Hub Sign in</h3>
                {showInValid()}
                    <label 
                        htmlFor='userName'>User Name or Email Address
                    </label>
                    <input 
                        type='text' 
                        name='userName' 
                        id='userName'
                        onChange={e=>setUserName(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <label 
                        htmlFor='password'>Password
                    </label>
                    <input 
                        type='text' 
                        name='password' 
                        id='password'
                        onChange={e=>setPassword(e.target.value)}
                        >
                    </input>
                    <br></br>
                    <button onClick={()=>{checkValid()}}>Sign in</button>
                    <button onClick={()=>{props.setTrigger(false);setValid(0);props.setShowButton(true); props.setSwitchButton(true)}}>Cancel</button>
        </div>
      ): ""
}

const sampleDockerAccounts = [
    {
        userName: 'apple',
        password: 'bristol',
        images: [
            {
                id:1,
                name: 'image1image1image1image1',
                dateModified: '29-Jan-2022'
              },
              {
                id:2,
                name: 'image2image2image2image2',
                dateModified: '20-Apr-2022'
              },
              {
                id:3,
                name: 'image3image3image3image3',
                dateModified: '01-Jan-2022'
              },
              {
                id:4,
                name: 'image4image4image4image4',
                dateModified: '15-Mar-2022'
              },
              {
                id:5,
                name: 'image5image5image5image5',
                dateModified: '06-Mar-2022'
              }
        ]

    },
    {
        userName: 'yulin',
        password: 'bristol',
        images: [
            {
                id:6,
                name: 'image6image6image6image6',
                dateModified: '29-Jan-2022'
            },
            {
                id:7,
                name: 'image7image7image7image7',
                dateModified: '20-Apr-2022'
            },
        ]
    }
]
