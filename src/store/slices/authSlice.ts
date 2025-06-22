// store/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  isAuthenticated: boolean
  userData: {
    userId: string
    firstName: string
    lastName: string
    email: string
  }
}

const initialState: AuthState = {
  isAuthenticated: false,
  userData: {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
  },
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.isAuthenticated = false
    },
    setUserData: (state, data) => {
      const { userId, firstName, lastName, email } = data.payload
      state.userData.userId = userId
      state.userData.firstName = firstName
      state.userData.lastName = lastName
      state.userData.email = email
    },
  },
})

export const { login, logout, setUserData } = authSlice.actions
export default authSlice.reducer
