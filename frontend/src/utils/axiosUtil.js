import axios from 'axios'
import { store } from '../app/store'
import { logout } from '../features/auth/authSlice'

export const axiosInstance = axios.create({
    baseURL: 'https://excelanalyticsplatform-4yu7.onrender.com/api',
})

// // automatically logged oyt when token is invalid
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if(error.response && error.response.status === 401){
//             console.warn('Unauthorized - Logging out from frontend')
//             store.dispatch(logout())  // clears redux and local storage
//         }
//         return Promise.reject(error)
//     }
// )