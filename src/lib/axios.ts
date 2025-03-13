import axios from "axios"

const axiosHttp = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
})

export default axiosHttp

