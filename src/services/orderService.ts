/* eslint-disable @typescript-eslint/no-explicit-any */
// services/orderService.ts
import api from "../utils/api"

export const placeOrder = (addressId: number, couponCode?: string) =>
  api.post("/api/order/checkout", { addressId, couponCode })

export const validateCoupon = (code: string, subTotal: number) =>
  api.post("/api/coupon/validate", { code, subTotal })

export const getMyOrders = (params?: any) => api.get("/api/order/my", { params })

export const cancelOrder = (orderId: number) => api.put(`/api/order/${orderId}/cancel`)

export const submitReview = (reviewData: { orderId: number; productId: number | null; rating: number; comment?: string }) =>
  api.post("/api/review", reviewData)

export const trackOrder = (orderId: string | number) =>
  api.get(`/api/order/track?orderId=${orderId}`)

