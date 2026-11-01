import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import LoginLayout from '../layouts/LoginLayout'
import DangNhap from '../pages/dangnhap/DangNhap'
import Dashboard from '../pages/dashboard/Dashboard'
import TaiSanList from '../pages/taisan/TaiSanList'
import TaiSanDetail from '../pages/taisan/TaiSanDetail'
import TaiSanForm from '../pages/taisan/TaiSanForm'
import QuetQR from '../pages/quetqr/QuetQR'
import LuanChuyen from '../pages/luanchuyen/LuanChuyen'
import KiemKe from '../pages/kiemke/KiemKe'
import DanhMuc from '../pages/danhmuc/DanhMuc'
import NguoiDung from '../pages/nguoidung/NguoiDung'
import TestPage from '../pages/test/TestPage'
import LoaiTaiSan from '../pages/admin/LoaiTaiSan'
import TaiSan from '../pages/admin/TaiSan'
import DonViViTri from '../pages/admin/DonViViTri'
import BaoTri from '../pages/admin/BaoTri'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dangnhap" element={<LoginLayout><DangNhap /></LoginLayout>} />
      
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="test" element={<TestPage />} />
        <Route path="taisan" element={<TaiSanList />} />
        <Route path="assets/:id" element={<TaiSanDetail />} />
        <Route path="quetqr" element={<QuetQR />} />
        
        <Route path="taisan/them" element={<AdminRoute><TaiSanForm /></AdminRoute>} />
        <Route path="taisan/:id/sua" element={<AdminRoute><TaiSanForm /></AdminRoute>} />
        <Route path="luanchuyen" element={<AdminRoute><LuanChuyen /></AdminRoute>} />
        <Route path="kiemke" element={<AdminRoute><KiemKe /></AdminRoute>} />
        <Route path="danhmuc" element={<AdminRoute><DanhMuc /></AdminRoute>} />
        <Route path="nguoidung" element={<AdminRoute><NguoiDung /></AdminRoute>} />
        
        {/* Admin pages */}
        <Route path="admin/loai-tai-san" element={<AdminRoute><LoaiTaiSan /></AdminRoute>} />
        <Route path="admin/tai-san" element={<AdminRoute><TaiSan /></AdminRoute>} />
        <Route path="admin/don-vi-vi-tri" element={<AdminRoute><DonViViTri /></AdminRoute>} />
        <Route path="admin/bao-tri" element={<AdminRoute><BaoTri /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
