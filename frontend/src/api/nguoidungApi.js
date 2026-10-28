import axiosClient from './axiosClient'

const nguoidungApi = {
  getAll: (params) => axiosClient.get('/nguoidung', { params }),
  getById: (id) => axiosClient.get(`/nguoidung/${id}`),
  create: (data) => axiosClient.post('/nguoidung', data),
  update: (id, data) => axiosClient.put(`/nguoidung/${id}`, data),
  delete: (id) => axiosClient.delete(`/nguoidung/${id}`),
  resetPassword: (id) => axiosClient.post(`/nguoidung/${id}/reset-password`),
}

export default nguoidungApi
