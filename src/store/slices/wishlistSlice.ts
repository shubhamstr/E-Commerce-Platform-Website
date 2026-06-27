// store/slices/wishlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface WishlistItem {
  id: number
  userId: number
  productId: number
  product: {
    id: number
    name: string
    price: number
    imageUrl?: string
    description?: string
  }
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.items.some((item) => item.productId === action.payload.productId)) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
