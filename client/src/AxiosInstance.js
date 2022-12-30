import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://relier.tk/api',
   
});

axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default {
    get:instance.get,
    post:instance.post,
    put:instance.put,
    }    