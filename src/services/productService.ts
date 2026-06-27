/* eslint-disable @typescript-eslint/no-explicit-any */
// services/productService.ts
import api from "../utils/api"

export const getProducts = (options?: any) => api.get("/api/product/get", options)
