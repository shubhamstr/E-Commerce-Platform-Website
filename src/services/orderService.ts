// services/orderService.ts
import api from "../utils/api"

export const placeOrder = (addressId: number) =>
  api.post("/api/order/checkout", { addressId })
