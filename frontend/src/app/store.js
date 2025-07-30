import { configureStore } from '@reduxjs/toolkit'
import authRecucer from '../features/auth/authSlice'
import uploadReducer from '../features/upload/uploadSlice'

export const store = configureStore({
    reducer: {
        auth: authRecucer,
        upload: uploadReducer
    },
})