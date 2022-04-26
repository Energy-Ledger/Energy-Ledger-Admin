import axios from 'axios';
import configService from '../services/config.service';
const API_URL = configService.getApiUrl();

const axiosService = axios.create({
    baseURL: API_URL,
});

axiosService.interceptors.request.use((config) => {
    // const user = JSON.parse(localStorage.getItem('user'));

    // const token = user.data.token;
    config.params = config.params || {};
    config.headers["Accept"] = "application/json";
    config.headers["Content-type"] = "application/json";
    // config.headers["Authorization"] = "bearer " + token;

    return config;
});

export default axiosService;