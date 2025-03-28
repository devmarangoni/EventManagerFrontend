import axios from "axios"
import { apiUrl } from "@/lib/ambientVariables";

const axiosHttp = axios.create({
  baseURL: apiUrl,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
})

export default axiosHttp