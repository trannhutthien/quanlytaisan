import axiosClient from './axiosClient'

const viTriApi = {
  // Lấy tất cả vị trí
  getAll: () => axiosClient.get('/vi-tri'),
  
  // Lấy vị trí theo ID
  getById: (id) => axiosClient.get(`/vi-tri/${id}`),
  
  // Lấy vị trí theo đơn vị
  getByDonVi: (donviId) => axiosClient.get(`/vi-tri/don-vi/${donviId}`),
  
  // Tạo vị trí mới
  create: (data) => axiosClient.post('/vi-tri', data),
  
  // Cập nhật vị trí
  update: (id, data) => axiosClient.put(`/vi-tri/${id}`, data),
  
  // Xóa vị trí
  delete: (id) => axiosClient.delete(`/vi-tri/${id}`),
}

export default viTriApi
