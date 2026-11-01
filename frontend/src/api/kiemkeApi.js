import axiosClient from './axiosClient'

const kiemkeApi = {
  // Quản lý đợt kiểm kê
  createDotKiemKe: (data) => axiosClient.post('/kiem-ke/dot-kiem-ke', data),
  
  getAllDotKiemKe: (trangthai) => {
    const params = trangthai ? { trangthai } : {}
    return axiosClient.get('/kiem-ke/dot-kiem-ke', { params })
  },
  
  getDotKiemKeById: (id) => axiosClient.get(`/kiem-ke/dot-kiem-ke/${id}`),
  
  getChiTietKiemKe: (id) => axiosClient.get(`/kiem-ke/dot-kiem-ke/${id}/chi-tiet`),
  
  dongDotKiemKe: (id) => axiosClient.put(`/kiem-ke/dot-kiem-ke/${id}/dong`),
  
  // Kiểm tra tài sản
  kiemTraTaiSan: (data) => axiosClient.post('/kiem-ke/kiem-tra', data),
}

export default kiemkeApi
