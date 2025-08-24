import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const BASE_URL = import.meta.env.MODE == "development" ? `${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api` : '/api';

const api = axios.create({
  baseURL: BASE_URL,
})

// always pull freshest token from Zustand (not from localStorage directly)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  }
)

export default api
