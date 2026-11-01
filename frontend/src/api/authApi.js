import axiosClient from './axiosClient'

const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  getCurrentUser: () => axiosClient.get('/auth/me'),
  changePassword: (data) => axiosClient.post('/auth/change-password', data),
  logout: () => axiosClient.post('/auth/logout'),
}

export default authApi
