// services/wishlistService.ts
import api from "../utils/api"

export const getWishlist = () => api.get("/api/wishlist")
export const toggleWishlist = (productId: number) => api.post("/api/wishlist/toggle", { productId })
