// src/utils/toast.ts
import { toast } from "react-toastify"

export const showSuccess = (message: string, options?: Parameters<typeof toast.success>[1]) => {
  toast.success(message, options)
}

export const showError = (message: string) => {
  toast.error(message)
}

export const showInfo = (message: string) => {
  toast.info(message)
}

export const showWarning = (message: string) => {
  toast.warning(message)
}
