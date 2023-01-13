import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://relier.tk/api',
   
});

axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

const images = 'https://relier.tk/api'

export default {
    get:instance.get,
    post:instance.post,
    put:instance.put,
    images
    }   