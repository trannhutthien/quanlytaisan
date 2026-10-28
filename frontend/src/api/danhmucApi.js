import axiosClient from './axiosClient'

const danhmucApi = {
  // Đơn vị
  getDonVi: () => axiosClient.get('/danhmuc/donvi'),
  createDonVi: (data) => axiosClient.post('/danhmuc/donvi', data),
  updateDonVi: (id, data) => axiosClient.put(`/danhmuc/donvi/${id}`, data),
  deleteDonVi: (id) => axiosClient.delete(`/danhmuc/donvi/${id}`),

  // Vị trí
  getViTri: () => axiosClient.get('/danhmuc/vitri'),
  createViTri: (data) => axiosClient.post('/danhmuc/vitri', data),
  updateViTri: (id, data) => axiosClient.put(`/danhmuc/vitri/${id}`, data),
  deleteViTri: (id) => axiosClient.delete(`/danhmuc/vitri/${id}`),

  // Loại tài sản
  getLoaiTaiSan: () => axiosClient.get('/danhmuc/loaitaisan'),
  createLoaiTaiSan: (data) => axiosClient.post('/danhmuc/loaitaisan', data),
  updateLoaiTaiSan: (id, data) => axiosClient.put(`/danhmuc/loaitaisan/${id}`, data),
  deleteLoaiTaiSan: (id) => axiosClient.delete(`/danhmuc/loaitaisan/${id}`),
}

export default danhmucApi
