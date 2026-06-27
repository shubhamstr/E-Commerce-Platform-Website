// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: number
  userId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    imageUrl?: string
    description?: string
  }
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
    addToCartState: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      )
      if (existing) {
        existing.quantity = action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    updateQuantityState: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId
      )
      if (existing) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.productId !== action.payload.productId
          )
        } else {
          existing.quantity = action.payload.quantity
        }
      }
    },
    removeFromCartState: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      )
    },
    clearCartState: (state) => {
      state.items = []
    },
  },
})

export const {
  setCart,
  addToCartState,
  updateQuantityState,
  removeFromCartState,
  clearCartState,
} = cartSlice.actions
export default cartSlice.reducer
