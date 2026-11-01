import axiosClient from './axiosClient'

const trangThaiApi = {
  // Lấy tất cả trạng thái tài sản
  getAll: () => axiosClient.get('/trang-thai-tai-san'),
}

export default trangThaiApi
