// services/orderService.ts
import api from "../utils/api"

export const placeOrder = (addressId: number) =>
  api.post("/api/order/checkout", { addressId })

export const getMyOrders = () => api.get("/api/order/my")

export const cancelOrder = (orderId: number) => api.put(`/api/order/${orderId}/cancel`)

export const submitReview = (reviewData: { orderId: number; productId: number | null; rating: number; comment?: string }) =>
  api.post("/api/review", reviewData)

