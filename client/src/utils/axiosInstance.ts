import axios from "axios";

const API_BASE_URL: string = 'http://localhost:5000/the-vocab-deck-api/v1';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export default axiosInstance;