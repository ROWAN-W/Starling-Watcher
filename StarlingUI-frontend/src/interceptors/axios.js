import axios from "axios";
import { getCookie } from 'react-use-cookie'
const REFRESH_URL = 'http://localhost:8080/refresh';

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    //not start from login or register
    if (getCookie('refreshToken') !=='' && error.response.status === 401 && !refresh) {
        refresh = true;
        const refreshToken = getCookie('refreshToken');
        console.log("axios refresh "+refreshToken);
        const response = await axios.get(REFRESH_URL,
            {
                headers: { 
                    'Authorization': `Bearer ${refreshToken}` ,
                },
            }, );
        //get a new access token
        if (response.status === 200) {
            error.config.headers.Authorization = `Bearer ${response.data['accessToken']}`;
            console.log("axios access "+response.data['accessToken']);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['accessToken']}`;            
            refresh = false;
            return axios(error.config);
        }
    }
    else{
        refresh = false;
        console.log("other error");
        throw error;
    }
});