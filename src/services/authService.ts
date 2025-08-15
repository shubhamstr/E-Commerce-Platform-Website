/* eslint-disable @typescript-eslint/no-explicit-any */
// services/authService.ts
import api from "../utils/api"

export const registerUser = (data: any) => api.post("/api/user/register", data)
export const loginUser = (data: any) => api.post("/api/user/login", data)
export const getUser = (id: any) => api.get(`/api/user/get/${id}`)
export const updateUser = (id: any, data: any) => api.post(`/api/user/update/${id}`, data)
export const getUserAddresses = (id: any) => api.get(`/api/address/get/user/${id}`)
