import axiosClient from './axiosClient'

const luanchuyenApi = {
  getAll: (params) => axiosClient.get('/luanchuyen', { params }),
  getById: (id) => axiosClient.get(`/luanchuyen/${id}`),
  create: (data) => axiosClient.post('/luanchuyen', data),
  update: (id, data) => axiosClient.put(`/luanchuyen/${id}`, data),
  approve: (id) => axiosClient.post(`/luanchuyen/${id}/approve`),
  reject: (id, reason) => axiosClient.post(`/luanchuyen/${id}/reject`, { reason }),
}

export default luanchuyenApi
