// services/api.ts
import axios from "axios"
import { SERVER_URL } from "../utils/constants"

const api = axios.create({
  baseURL: SERVER_URL, // central base URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token dynamically if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ecomToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
