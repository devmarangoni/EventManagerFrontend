import axios from "axios"

const apiUrl = process.env.REACT_APP_API_URL;
console.log(`api url: ${apiUrl}`);

const axiosHttp = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
})

export default axiosHttp