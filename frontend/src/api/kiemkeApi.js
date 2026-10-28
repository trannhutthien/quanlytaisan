import axiosClient from './axiosClient'

const kiemkeApi = {
  getDotKiemKe: (params) => axiosClient.get('/kiemke', { params }),
  getById: (id) => axiosClient.get(`/kiemke/${id}`),
  createDot: (data) => axiosClient.post('/kiemke', data),
  updateDot: (id, data) => axiosClient.put(`/kiemke/${id}`, data),
  getChiTiet: (dotId) => axiosClient.get(`/kiemke/${dotId}/chitiet`),
  saveKetQua: (dotId, taisanId, ketQua) => 
    axiosClient.post(`/kiemke/${dotId}/chitiet`, { taisanId, ketQua }),
  closeDot: (id) => axiosClient.post(`/kiemke/${id}/close`),
}

export default kiemkeApi
