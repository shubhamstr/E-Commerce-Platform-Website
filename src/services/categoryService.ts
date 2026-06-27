/* eslint-disable @typescript-eslint/no-explicit-any */
// services/categoryService.ts
import api from "../utils/api"

export const getAllCategories = (options?: any) => api.get("/api/category/get", options)
