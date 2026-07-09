// import axios from "axios";

// const api = axios.create({
//   // baseURL: "http://localhost:3000/api",
//   baseURL:"https://codo-backend.vercel.app/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// export default api;


import axios from "axios";

// This will automatically look for the variable you just saved in Vercel!
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || process.env.VITE_API_URL || "http://16.171.200.174:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;