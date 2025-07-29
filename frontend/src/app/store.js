import { configureStore } from '@reduxjs/toolkit'
import authRecucer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        auth:authRecucer,
    },
})