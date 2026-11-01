import axiosClient from './axiosClient'

const donViApi = {
  // Lấy tất cả đơn vị
  getAll: () => axiosClient.get('/don-vi'),
  
  // Lấy đơn vị theo ID
  getById: (id) => axiosClient.get(`/don-vi/${id}`),
  
  // Tạo đơn vị mới
  create: (data) => axiosClient.post('/don-vi', data),
  
  // Cập nhật đơn vị
  update: (id, data) => axiosClient.put(`/don-vi/${id}`, data),
  
  // Xóa đơn vị
  delete: (id) => axiosClient.delete(`/don-vi/${id}`),
}

export default donViApi
