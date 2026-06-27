// services/api.ts
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { SERVER_URL } from "../utils/constants"

const api = axios.create({
  baseURL: SERVER_URL, // central base URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token dynamically if needed
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ecomToken")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          localStorage.removeItem("ecomToken")
          window.location.href = "/login"
          return Promise.reject(new Error("Token expired"))
        }
      } catch (error) {
        console.error("Error decoding token in request interceptor:", error)
      }
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Add response interceptor to handle 401/403 errors (expired/invalid tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response) {
      const { status } = error.response
      if (status === 401 || status === 403) {
        localStorage.removeItem("ecomToken")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
