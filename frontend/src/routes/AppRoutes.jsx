import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import LoginLayout from '../layouts/LoginLayout'
import DangNhap from '../pages/dangnhap/DangNhap'
import Dashboard from '../pages/dashboard/Dashboard'
import TaiSanList from '../pages/taisan/TaiSanList'
import TaiSanDetail from '../pages/taisan/TaiSanDetail'
import QuetQR from '../pages/quetqr/QuetQR'
import LuanChuyen from '../pages/luanchuyen/LuanChuyen'
import BaoTri from '../pages/baotri/BaoTri'
import KiemKe from '../pages/kiemke/KiemKe'
import DanhMuc from '../pages/danhmuc/DanhMuc'
import NguoiDung from '../pages/nguoidung/NguoiDung'

// TaiSanForm placeholder - sẽ được phát triển sau
const TaiSanForm = () => <div>Form Tài sản - Đang phát triển</div>

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dangnhap" element={<LoginLayout><DangNhap /></LoginLayout>} />
      
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="taisan" element={<TaiSanList />} />
        <Route path="assets/:id" element={<TaiSanDetail />} />
        <Route path="quetqr" element={<QuetQR />} />
        
        <Route path="taisan/them" element={<AdminRoute><TaiSanForm /></AdminRoute>} />
        <Route path="taisan/:id/sua" element={<AdminRoute><TaiSanForm /></AdminRoute>} />
        <Route path="luanchuyen" element={<AdminRoute><LuanChuyen /></AdminRoute>} />
        <Route path="baotri" element={<BaoTri />} />
        <Route path="kiemke" element={<AdminRoute><KiemKe /></AdminRoute>} />
        <Route path="danhmuc" element={<AdminRoute><DanhMuc /></AdminRoute>} />
        <Route path="nguoidung" element={<AdminRoute><NguoiDung /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
