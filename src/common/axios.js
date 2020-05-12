import axios from "axios";

const _axios = axios.create({
    timeout: 10000,
});


_axios.interceptors.request.use(
    (config) => {
        // config.headers.Authorization = "Bearer "
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

    
_axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    });

export default _axios;