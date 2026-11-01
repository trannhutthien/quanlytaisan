import axiosClient from './axiosClient'

const loaiTaiSanApi = {
  // Lay tat ca loai tai san
  getAll: () => axiosClient.get('/loai-tai-san'),
  
  // Lay loai tai san theo ID
  getById: (id) => axiosClient.get(`/loai-tai-san/${id}`),
  
  // Tao loai tai san moi
  create: (data) => axiosClient.post('/loai-tai-san', data),
  
  // Cap nhat loai tai san
  update: (id, data) => axiosClient.put(`/loai-tai-san/${id}`, data),
  
  // Xoa loai tai san
  delete: (id) => axiosClient.delete(`/loai-tai-san/${id}`),
}

export default loaiTaiSanApi
