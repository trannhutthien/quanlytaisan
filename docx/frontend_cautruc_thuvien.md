# FRONTEND – HỆ THỐNG QUẢN LÝ TÀI SẢN BẰNG MÃ QR

Tài liệu mô tả cấu trúc thư mục, thư viện và quy ước cho phần frontend. Dùng để giao cho trợ lý AI hoặc tham khảo khi tạo dự án.

## 1. Lựa chọn công nghệ

| Hạng mục | Lựa chọn |
|---|---|
| Ngôn ngữ | JavaScript (JSX) |
| Framework | ReactJS 18 |
| Công cụ build | Vite |
| Giao diện | Ant Design 5 |
| Điều hướng | react-router-dom 6 |
| Gọi API | axios |
| Quét mã QR | html5-qrcode (dùng camera điện thoại qua trình duyệt) |
| Biểu đồ | recharts |
| Ngày tháng | dayjs |
| Backend | Spring Boot chạy ở `http://localhost:8080` |

## 2. Công cụ cần cài trên máy

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| Node.js | 20 LTS trở lên | Kèm theo `npm` |
| VS Code | Bản mới | Cài thêm extension ESLint, Prettier, ES7 React snippets |
| Trình duyệt | Chrome | Dùng DevTools để gỡ lỗi |

Kiểm tra sau khi cài: `node -v` và `npm -v`.

## 3. Khởi tạo dự án

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

## 4. Thư viện cần cài

```bash
npm install react-router-dom axios antd @ant-design/icons html5-qrcode recharts dayjs
```

| Thư viện | Công dụng |
|---|---|
| `react-router-dom` | Chuyển trang, chặn trang khi chưa đăng nhập |
| `axios` | Gọi API backend, gắn JWT vào mọi yêu cầu |
| `antd`, `@ant-design/icons` | Bảng, form, menu, nút, thông báo có sẵn |
| `html5-qrcode` | Mở camera và đọc mã QR trên trình duyệt |
| `recharts` | Biểu đồ thống kê ở dashboard |
| `dayjs` | Xử lý và định dạng ngày tháng |

Chạy thử: `npm run dev`, mở `http://localhost:5173`.

## 5. Cấu trúc thư mục

```
frontend/
├── package.json
├── vite.config.js
├── .env
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── routes/
    ├── api/
    ├── context/
    ├── hooks/
    ├── layouts/
    ├── components/
    ├── pages/
    │   ├── dangnhap/
    │   ├── dashboard/
    │   ├── taisan/
    │   ├── quetqr/
    │   ├── luanchuyen/
    │   ├── baotri/
    │   ├── kiemke/
    │   ├── danhmuc/
    │   └── nguoidung/
    ├── utils/
    └── assets/
```

Lệnh tạo nhanh các thư mục (chạy trong thư mục gốc `frontend`, bằng Git Bash, macOS hoặc Linux):

```bash
cd src
mkdir routes api context hooks layouts components utils
mkdir -p pages/dangnhap pages/dashboard pages/taisan pages/quetqr pages/luanchuyen pages/baotri pages/kiemke pages/danhmuc pages/nguoidung
cd ..
```

## 6. Nội dung từng thư mục

| Thư mục | Nội dung |
|---|---|
| `routes` | `AppRoutes.jsx` (khai báo đường dẫn), `PrivateRoute.jsx` (chặn khi chưa đăng nhập), `AdminRoute.jsx` (chỉ ADMIN vào được) |
| `api` | `axiosClient.js` (cấu hình chung, gắn token), `authApi.js`, `taisanApi.js`, `luanchuyenApi.js`, `baotriApi.js`, `kiemkeApi.js`, `thongkeApi.js`, `danhmucApi.js`, `nguoidungApi.js` |
| `context` | `AuthContext.jsx` lưu người dùng đang đăng nhập, token và vai trò |
| `hooks` | `useAuth.js` và các hook dùng chung như `useDebounce.js` |
| `layouts` | `MainLayout.jsx` (thanh menu bên trái và phần đầu trang), `LoginLayout.jsx` |
| `components` | Thành phần dùng lại: `QrScanner.jsx` (quét bằng camera), `QrImage.jsx` (hiện ảnh QR để in), `StatusTag.jsx` (nhãn màu theo trạng thái), `ConfirmDialog.jsx` |
| `pages/dangnhap` | Trang đăng nhập |
| `pages/dashboard` | Thống kê số lượng tài sản theo trạng thái (đang sử dụng, còn trống, bảo trì, hư hỏng) |
| `pages/taisan` | Danh sách có tìm kiếm và lọc theo khoa, phòng, bộ môn; form thêm, sửa; trang chi tiết kèm mã QR và lịch sử |
| `pages/quetqr` | Mở camera quét mã, hiển thị ngay thông tin tài sản |
| `pages/luanchuyen` | Lập phiếu bàn giao, thu hồi, điều chuyển; xem lịch sử |
| `pages/baotri` | Báo hỏng, theo dõi tiến trình sửa chữa, lịch bảo trì định kỳ |
| `pages/kiemke` | Tạo đợt kiểm kê, quét QR ghi nhận kết quả |
| `pages/danhmuc` | Quản lý đơn vị, vị trí, loại tài sản (ADMIN) |
| `pages/nguoidung` | Quản lý người dùng, phân quyền (ADMIN) |
| `utils` | Định dạng tiền, ngày; hằng số trạng thái và màu |

## 7. Danh sách đường dẫn (route)

| Đường dẫn | Trang | Quyền |
|---|---|---|
| `/dangnhap` | Đăng nhập | Công khai |
| `/` | Dashboard | Đã đăng nhập |
| `/taisan` | Danh sách tài sản | Đã đăng nhập |
| `/taisan/them` | Thêm tài sản | ADMIN |
| `/taisan/:id/sua` | Sửa tài sản | ADMIN |
| `/assets/:id` | Trang tra cứu sau khi quét QR | Đã đăng nhập |
| `/quetqr` | Quét mã QR | Đã đăng nhập |
| `/luanchuyen` | Bàn giao, thu hồi | ADMIN |
| `/baotri` | Báo hỏng, sửa chữa | Đã đăng nhập (USER chỉ báo hỏng) |
| `/kiemke` | Kiểm kê | ADMIN |
| `/danhmuc` | Đơn vị, vị trí, loại tài sản | ADMIN |
| `/nguoidung` | Người dùng | ADMIN |

Đường dẫn `/assets/:id` bắt buộc đúng dạng này, vì mã QR chứa URL `https://domain.com/assets/{taisan_id}`.

## 8. Cấu hình

**File `.env`:**

```
VITE_API_URL=http://localhost:8080/api
```

**File `vite.config.js`** (cho phép mở bằng điện thoại cùng mạng Wi-Fi):

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
```

**File `src/api/axiosClient.js`:**

```js
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/dangnhap'
    }
    return Promise.reject(err)
  }
)

export default axiosClient
```

Backend cần bật CORS cho `http://localhost:5173` (cấu hình trong `CorsConfig` ở backend).

## 9. Quy ước bắt buộc

1. **Tên thư mục và file trang** viết thường, tiếng Việt không dấu, viết liền, giống quy tắc đặt tên bên CSDL. Tên component React vẫn viết hoa chữ đầu (ví dụ `TaiSanList.jsx`).
2. **Mọi lời gọi API** đều đi qua thư mục `api`, trang không gọi `axios` trực tiếp.
3. **Token JWT** lưu trong `localStorage`, gắn vào mọi yêu cầu qua `axiosClient`. Gặp lỗi 401 thì quay về trang đăng nhập.
4. **Phân quyền giao diện:** USER chỉ thấy menu Dashboard, Tài sản (xem), Quét QR và Báo hỏng; ADMIN thấy toàn bộ. Việc ẩn menu chỉ là phụ, backend vẫn phải kiểm tra quyền thật.
5. **Trạng thái tài sản** dùng đúng 4 mã `IN_USE`, `AVAILABLE`, `MAINTENANCE`, `BROKEN`, hiển thị bằng `StatusTag` với màu cố định: xanh lá, xanh dương, cam, đỏ.
6. **Ảnh QR:** gọi API backend trả ảnh PNG theo `taisan_id`, hiển thị trong `QrImage`, có nút in. Frontend không tự sinh QR.
7. **Quét QR:** `QrScanner` đọc chuỗi, lấy `taisan_id` ở cuối URL rồi chuyển đến `/assets/{id}`.
8. **Camera trên điện thoại** chỉ chạy được khi trang mở bằng HTTPS (riêng `localhost` thì được). Khi thử trên điện thoại thật, dùng ngrok hoặc triển khai bản có HTTPS.
9. **Giao diện:** ưu tiên dùng component của Ant Design (`Table`, `Form`, `Modal`, `message`), không tự viết lại. Giao diện phải xem được trên điện thoại vì người dùng quét QR bằng máy này.

## 10. Thứ tự thực hiện gợi ý

1. Tạo dự án, cài thư viện, tạo thư mục, chạy được `npm run dev`.
2. Cấu hình `axiosClient`, `AuthContext`, `PrivateRoute`, `MainLayout`.
3. Trang đăng nhập, nối với API backend.
4. Danh sách tài sản (bảng, tìm kiếm, lọc).
5. Form thêm, sửa tài sản; trang chi tiết kèm ảnh QR.
6. Trang `/assets/:id` và trang quét QR.
7. Luân chuyển (bàn giao, thu hồi).
8. Bảo trì và báo hỏng.
9. Kiểm kê.
10. Dashboard với biểu đồ trạng thái.
11. Quản lý danh mục và người dùng.

Sau mỗi bước, trang phải chạy được và gọi được API thật của backend.
