/* eslint-disable @typescript-eslint/no-explicit-any */
// services/authService.ts
import api from "../utils/api"

// export const getUserProfile = () => api.get("/user/profile")
// export const updateUser = (id: string, data: any) =>
//   api.put(`/user/${id}`, data)
export const registerUser = (data: any) => api.post("/user", data)
