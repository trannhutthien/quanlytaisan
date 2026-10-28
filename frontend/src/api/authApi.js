import axiosClient from './axiosClient'

const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  getCurrentUser: () => axiosClient.get('/auth/me'),
  logout: () => axiosClient.post('/auth/logout'),
}

export default authApi
