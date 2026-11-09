# Frontend – Hệ thống Quản lý Tài sản bằng mã QR

Giao diện ReactJS 18 + Vite + Ant Design 5 cho hệ thống quản lý tài sản bằng mã QR.

- **Trang web**: https://trannhutthien.github.io/quanlytaisan/
- **API backend**: https://quanlytaisan-6hhw.onrender.com/api
- **Repository**: https://github.com/trannhutthien/quanlytaisan

## Công nghệ sử dụng

| Nhóm | Công nghệ |
|------|-----------|
| Framework | React 18.3.1, Vite 5.4.2 |
| UI | Ant Design 5.20.0, @ant-design/icons 5.4.0 |
| Routing | React Router DOM 6.26.0 (HashRouter) |
| HTTP | Axios 1.7.5 |
| Quét QR | html5-qrcode 2.3.8 |
| Biểu đồ | Recharts 2.12.7 |
| Ngày tháng | DayJS 1.11.12 |

Hosting trên **GitHub Pages**, CI/CD bằng **GitHub Actions**, build với base path `/quanlytaisan/`.

## Cài đặt và chạy local

### 1. Cài dependencies

```bash
npm install
```

### 2. Cấu hình API URL

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Nội dung `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

File `.env` đã nằm trong `.gitignore`, không push lên Git.

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng chạy tại: `http://localhost:5173/quanlytaisan/` (do `base: '/quanlytaisan/'` trong `vite.config.js`).

### 4. Build production

```bash
npm run build
```

## Triển khai lên GitHub Pages

- Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), tự chạy khi push nhánh `main`.
- Repository variable: **Settings → Secrets and variables → Actions → Variables**
  - `VITE_API_URL = https://quanlytaisan-6hhw.onrender.com/api`
- **Settings → Pages → Source: GitHub Actions**.
- Biến `VITE_API_URL` được nhúng lúc build, nên sau khi đổi giá trị phải chạy lại workflow.

Ứng dụng dùng `HashRouter` để các route như `/#/assets/1` hoạt động khi refresh trên GitHub Pages. Mã QR cũng trỏ tới dạng URL này.

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/              # Axios clients (authApi, taisanApi, ...)
│   ├── components/       # QrScanner, QrImage, StatusTag, ConfirmDialog, ...
│   ├── context/          # AuthContext
│   ├── hooks/            # useAuth, useAutoCode
│   ├── layouts/          # MainLayout (sidebar), LoginLayout
│   ├── pages/
│   │   ├── dangnhap/     # Đăng nhập
│   │   ├── dashboard/    # Dashboard ADMIN và USER
│   │   ├── taisan/       # Quản lý tài sản
│   │   ├── quetqr/       # Quét QR
│   │   ├── luanchuyen/   # Luân chuyển
│   │   ├── kiemke/       # Kiểm kê
│   │   ├── admin/        # Bảo trì, đơn vị/vị trí, loại tài sản, tài sản
│   │   └── nguoidung/    # Quản lý người dùng
│   ├── routes/           # AppRoutes
│   ├── utils/            # constants, format, permissions
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vite.config.js
└── package.json
```

## Tính năng đã triển khai

- Đăng nhập JWT, phân quyền ADMIN/USER theo trang.
- CRUD tài sản, tìm kiếm/lọc, xem chi tiết, sinh và in mã QR.
- Quét QR bằng camera, mở thẳng trang chi tiết tài sản.
- Luân chuyển (bàn giao, thu hồi, điều chuyển), bảo trì, kiểm kê.
- Dashboard thống kê cho ADMIN và USER, biểu đồ Recharts.
- Quản lý người dùng, phân quyền, đổi mật khẩu.
- Giao diện responsive cho điện thoại và tablet.

## Lưu ý

### Authentication
- Token JWT lưu trong `localStorage`, Axios tự gắn header `Authorization`.
- Gặp 401 sẽ tự chuyển về trang đăng nhập kèm base path.

### Camera và HTTPS
Camera chỉ hoạt động trên `localhost` hoặc HTTPS. Bản deploy GitHub Pages dùng HTTPS nên quét QR trên điện thoại hoạt động bình thường.

### Responsive
- Điện thoại: card list, phân trang đơn giản, modal full chiều rộng.
- Tablet/desktop: bảng đầy đủ, thao tác trong dropdown.

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production vào `dist/` |
| `npm run preview` | Xem thử bản production build |
