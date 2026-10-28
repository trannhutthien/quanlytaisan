import axiosClient from './axiosClient'

const taisanApi = {
  getAll: (params) => axiosClient.get('/taisan', { params }),
  getById: (id) => axiosClient.get(`/taisan/${id}`),
  create: (data) => axiosClient.post('/taisan', data),
  update: (id, data) => axiosClient.put(`/taisan/${id}`, data),
  delete: (id) => axiosClient.delete(`/taisan/${id}`),
  getQrCode: (id) => axiosClient.get(`/taisan/${id}/qrcode`, { responseType: 'blob' }),
  getLichSu: (id) => axiosClient.get(`/taisan/${id}/lichsu`),
}

export default taisanApi
