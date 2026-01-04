import axios from "axios";

const api = axios.create({
    baseURL: "https://codo-backend.vercel.app/api",
    withCredentials: true
});

export default api;
