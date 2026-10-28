import axiosClient from './axiosClient'

const baotriApi = {
  getAll: (params) => axiosClient.get('/baotri', { params }),
  getById: (id) => axiosClient.get(`/baotri/${id}`),
  create: (data) => axiosClient.post('/baotri', data),
  update: (id, data) => axiosClient.put(`/baotri/${id}`, data),
  updateTrangThai: (id, trangThai) => axiosClient.patch(`/baotri/${id}/trangthai`, { trangThai }),
}

export default baotriApi
