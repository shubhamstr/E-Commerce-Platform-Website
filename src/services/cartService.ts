// services/cartService.ts
import api from "../utils/api"

export const getCart = () => api.get("/api/cart")
export const addToCart = (productId: number, quantity: number = 1) =>
  api.post("/api/cart/add", { productId, quantity })
export const updateCartQuantity = (productId: number, quantity: number) =>
  api.put("/api/cart/update", { productId, quantity })
export const removeFromCart = (productId: number) =>
  api.delete(`/api/cart/remove/${productId}`)
export const clearCart = () => api.delete("/api/cart/clear")
