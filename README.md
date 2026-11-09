# Hệ thống Quản lý Tài sản bằng mã QR

[![Deploy frontend](https://github.com/trannhutthien/quanlytaisan/actions/workflows/deploy.yml/badge.svg)](https://github.com/trannhutthien/quanlytaisan/actions/workflows/deploy.yml)

Hệ thống quản lý tài sản toàn diện sử dụng mã QR để tra cứu, kiểm kê, bảo trì và luân chuyển tài sản. Hệ thống hỗ trợ quét QR bằng camera điện thoại, theo dõi lịch sử tài sản, quản lý bảo trì định kỳ và kiểm kê tài sản.

## 🌐 Chạy trực tuyến

| Thành phần | Địa chỉ |
|------------|---------|
| **Frontend** | https://trannhutthien.github.io/quanlytaisan/ |
| **Backend API** | https://quanlytaisan-6hhw.onrender.com/api |
| **Health check** | https://quanlytaisan-6hhw.onrender.com/api/health |
| **Mã nguồn** | https://github.com/trannhutthien/quanlytaisan |
| **Cơ sở dữ liệu** | TiDB Cloud Serverless (MySQL 8, region Singapore) |

> ⏱️ Backend chạy trên gói **Free của Render** nên tự ngủ sau 15 phút không có truy cập. Lần mở đầu tiên có thể chậm khoảng 1 phút để khởi động lại.

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Thư viện và công nghệ](#-thư-viện-và-công-nghệ)
- [Cài đặt và chạy local](#-cài-đặt-và-chạy-local)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Chức năng của hệ thống](#-chức-năng-của-hệ-thống)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Triển khai](#-triển-khai)
- [Bảo mật](#-bảo-mật)

## 🖥️ Yêu cầu hệ thống

### Phần mềm cần cài đặt trên máy

| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|----------|
| **Node.js** | 18.x hoặc 20.x LTS | Chạy frontend React |
| **Java JDK** | 17 (LTS) **BẮT BUỘC** | Chạy backend Spring Boot |
| **Maven** | 3.8+ | Build backend (hoặc dùng Maven Wrapper có sẵn) |
| **MySQL** | 8.0+ | Cơ sở dữ liệu khi chạy local |
| **Git** | Mới nhất | Quản lý source code |
| **Docker** | Tùy chọn | Build/chạy backend bằng container |

> ⚠️ **Java 17 là bắt buộc.** Spring Boot 3.3.5 và Lombok trong dự án chỉ chạy ổn định với Java 17. Kiểm tra bằng `java -version`.

## 🛠️ Thư viện và công nghệ

### Backend

| Nhóm | Công nghệ |
|------|-----------|
| Framework | Spring Boot 3.3.5, Java 17 |
| Bảo mật | Spring Security + JWT (JJWT 0.12.6) |
| Dữ liệu | Spring Data JPA, Hibernate, MySQL Connector/J 8.2.0 |
| Validation | Spring Validation (Jakarta Bean Validation) |
| Hỗ trợ code | Lombok 1.18.36 |
| QR Code | ZXing 3.5.3 (core + javase) |
| Xuất báo cáo | Apache POI 5.3.0 (Excel) |
| API docs | Springdoc OpenAPI 2.6.0 (Swagger UI) |
| Build | Maven, Spring Boot Maven Plugin |
| Đóng gói | Docker multi-stage (Maven 3.9 + Eclipse Temurin JRE 17) |

### Frontend

| Nhóm | Công nghệ |
|------|-----------|
| Framework | React 18.3.1, Vite 5.4.2 |
| UI | Ant Design 5.20.0, @ant-design/icons 5.4.0 |
| Routing | React Router DOM 6.26.0 (**HashRouter** để tương thích GitHub Pages) |
| HTTP | Axios 1.7.5 (JWT interceptor) |
| Quét QR | html5-qrcode 2.3.8 (camera/WebRTC) |
| Biểu đồ | Recharts 2.12.7 |
| Ngày tháng | DayJS 1.11.12 |
| Responsive | Ant Design Grid breakpoints, dạng card trên điện thoại và bảng trên tablet/desktop |

### Hạ tầng và triển khai

| Thành phần | Dịch vụ / công nghệ |
|------------|---------------------|
| Mã nguồn | GitHub – `trannhutthien/quanlytaisan` |
| Hosting frontend | **GitHub Pages** tại `/quanlytaisan/` |
| CI/CD frontend | **GitHub Actions** (`.github/workflows/deploy.yml`), build với biến `VITE_API_URL` |
| Hosting backend | **Render** – Web Service dạng Docker, gói Free, region Singapore |
| Cơ sở dữ liệu | **TiDB Cloud Serverless** (tương thích MySQL 8, cổng 4000, SSL) |
| Cấu hình | Biến môi trường trên Render, không hardcode bí mật trong code |
| Health check | `GET /api/health` (public) dùng cho Render và giữ dịch vụ không ngủ |
| Mã QR | Chứa URL `QR_BASE_URL + id` để quét là mở thẳng trang chi tiết tài sản |

### Biến môi trường backend

| Biến | Ý nghĩa | Mặc định khi chạy local |
|------|---------|--------------------------|
| `PORT` | Cổng server (Render cấp tự động) | `8080` |
| `DB_URL` | JDBC URL tới MySQL/TiDB | MySQL `localhost:3306` |
| `DB_USERNAME` | Tài khoản database | `root` |
| `DB_PASSWORD` | Mật khẩu database | rỗng |
| `DDL_AUTO` | `update` lần đầu, sau đó `validate` | `none` |
| `JWT_SECRET` | Khóa ký JWT (tối thiểu 32 ký tự) | giá trị mẫu |
| `JWT_EXPIRATION` | Thời hạn token (ms) | `86400000` |
| `CORS_ALLOWED_ORIGINS` | Origin frontend được phép, cách nhau bởi dấu phẩy | `localhost:5173`, ... |
| `QR_BASE_URL` | Tiền tố URL ghi vào mã QR | `http://localhost:5173/#/assets/` |

## 🚀 Cài đặt và chạy local

### Bước 1: Clone repository

```bash
git clone https://github.com/trannhutthien/quanlytaisan.git
cd quanlytaisan
```

### Bước 2: Chuẩn bị database

Chạy MySQL local rồi tạo database và import dữ liệu mẫu:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE quanlytaisanqr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p quanlytaisanqr < backend/src/main/resources/db/quanlytaisanqr_gon.sql
```

File SQL chứa schema đầy đủ, dữ liệu danh mục mẫu và 2 tài khoản mặc định.

> Nếu muốn dùng TiDB Cloud khi chạy local, tạo file `backend/src/main/resources/application-tidb.yml` (đã nằm trong `.gitignore`) hoặc đặt các biến `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` trong môi trường chạy.

### Bước 3: Chạy backend

```bash
cd backend

# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend chạy tại `http://localhost:8080/api`.

Kiểm tra nhanh:

```bash
curl http://localhost:8080/api/health
# OK
```

### Bước 4: Chạy frontend

```bash
cd frontend
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev
```

File `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Frontend chạy tại `http://localhost:5173/quanlytaisan/` (Vite base path `/quanlytaisan/`).

Đăng nhập bằng tài khoản mặc định ở phần [Tài khoản mặc định](#-tài-khoản-mặc-định).

## 📁 Cấu trúc dự án

```
quanlytaisan/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD đưa frontend lên GitHub Pages
├── backend/                           # Spring Boot Backend
│   ├── Dockerfile                     # Build Maven + chạy JRE 17
│   ├── .dockerignore
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd
│   └── src/main/
│       ├── java/com/tvu/quanlytaisan/
│       │   ├── config/                # Security, CORS, DataInitializer
│       │   ├── controller/            # REST Controllers + HealthController
│       │   ├── dto/                   # request/ + response/
│       │   ├── entity/                # JPA Entities
│       │   ├── enums/
│       │   ├── exception/             # Global Exception Handler
│       │   ├── repository/            # Spring Data JPA
│       │   ├── security/              # JWT Service, Auth Filter
│       │   └── service/               # Business Logic, QRCodeService
│       └── resources/
│           ├── application.yml        # Cấu hình đọc từ biến môi trường
│           ├── application-*.yml.example
│           └── db/                    # Schema + dữ liệu mẫu
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── api/                       # Axios clients
│   │   ├── components/                # QrScanner, QrImage, StatusTag, ...
│   │   ├── context/                   # AuthContext
│   │   ├── hooks/
│   │   ├── layouts/                   # MainLayout, LoginLayout
│   │   ├── pages/                     # dangnhap, dashboard, taisan, quetqr,
│   │   │                              # luanchuyen, kiemke, admin, nguoidung
│   │   ├── routes/AppRoutes.jsx
│   │   └── utils/                     # constants, format, permissions
│   ├── .env.example
│   ├── vite.config.js                 # base: '/quanlytaisan/'
│   └── package.json
├── docx/                              # Tài liệu hướng dẫn và báo cáo
└── README.md
```

## ✨ Chức năng của hệ thống

### 1. 🔐 Xác thực và phân quyền
- Đăng nhập JWT, token lưu trong `localStorage`.
- Hai vai trò: **ADMIN** (toàn quyền) và **USER** (xem tài sản, quét QR, báo hỏng).
- Phân quyền theo từng trang/chức năng, đổi mật khẩu, xem thông tin cá nhân.

### 2. 📦 Quản lý tài sản
- CRUD tài sản, tìm kiếm và lọc theo mã, tên, đơn vị, loại, trạng thái.
- Sinh mã QR tự động, in QR từng cái hoặc hàng loạt.
- Theo dõi lịch sử thay đổi trạng thái, vị trí, bảo trì.

### 3. 📱 Quét QR Code
- Quét bằng camera điện thoại/laptop.
- Mã QR chứa URL trang chi tiết tài sản nên quét là mở đúng tài sản.
- Ghi lại lịch sử quét.

### 4. 🔄 Luân chuyển tài sản
- Bàn giao, thu hồi, điều chuyển giữa người dùng và đơn vị.
- Hỗ trợ bên giao/bên nhận là người hoặc đơn vị, chọn vị trí cụ thể.
- Theo dõi lịch sử và trạng thái phê duyệt.

### 5. 🔧 Quản lý bảo trì
- Báo hỏng, lập phiếu sửa chữa, bảo trì định kỳ.
- Theo dõi chi phí và lịch sử bảo trì.
- Thống kê bảo trì theo đơn vị, loại tài sản và thời gian.

### 6. ✅ Kiểm kê tài sản
- Tạo đợt kiểm kê, phân công người thực hiện.
- Ghi nhận kết quả: đầy đủ, thiếu, sai vị trí, thừa.
- Báo cáo tổng hợp và tỷ lệ đạt.

### 7. 📊 Dashboard và thống kê
- Tổng số tài sản, theo trạng thái, đơn vị, loại tài sản.
- Biểu đồ trực quan (Recharts) và danh sách hoạt động gần đây.
- Dashboard riêng cho ADMIN và USER.

### 8. 📂 Quản lý danh mục
- Đơn vị, vị trí, loại tài sản, trạng thái tài sản.

### 9. 👥 Quản lý người dùng (Admin)
- CRUD tài khoản, gán vai trò và quyền theo trang.
- Reset mật khẩu, khóa/mở khóa tài khoản.

### 10. 📄 Xuất báo cáo
- Xuất danh sách tài sản và báo cáo kiểm kê ra Excel (Apache POI).
- In QR hàng loạt.

### 11. 📐 Giao diện responsive
- Điện thoại: danh sách dạng card, phân trang đơn giản, form/modal toàn chiều rộng.
- Tablet và desktop: bảng dữ liệu đầy đủ, thao tác gom vào dropdown.

## 👤 Tài khoản mặc định

| Vai trò | Username | Password | Quyền hạn |
|---------|----------|----------|-----------|
| **Admin** | `admin` | `admin123` | Toàn quyền quản lý hệ thống |
| **User** | `user` | `user123` | Xem tài sản, quét QR, báo hỏng |

> 🔒 Đổi mật khẩu ngay sau lần đăng nhập đầu tiên, đặc biệt khi chạy trên môi trường công khai.

## 📡 API Documentation

- Local: `http://localhost:8080/api`
- Production: `https://quanlytaisan-6hhw.onrender.com/api`
- Swagger UI (khi bật public trong `SecurityConfig`): `http://localhost:8080/api/swagger-ui.html`

### API endpoints chính

| Module | Base path | Mô tả |
|--------|-----------|-------|
| Authentication | `/api/auth` | Đăng nhập, thông tin user, đổi mật khẩu |
| Tài sản | `/api/tai-san` | CRUD, QR code, tìm kiếm |
| Luân chuyển | `/api/luanchuyen` | Bàn giao, thu hồi, điều chuyển |
| Bảo trì | `/api/bao-tri` | Báo hỏng, sửa chữa, thống kê |
| Kiểm kê | `/api/kiem-ke` | Tạo đợt, ghi nhận kết quả |
| Thống kê | `/api/thongke` | Dữ liệu dashboard |
| Đơn vị | `/api/don-vi` | CRUD đơn vị |
| Vị trí | `/api/vi-tri` | CRUD vị trí |
| Loại tài sản | `/api/loai-tai-san` | CRUD loại tài sản |
| Trạng thái | `/api/trang-thai-tai-san` | Danh mục trạng thái |
| Người dùng | `/api/nguoidung` | CRUD người dùng (Admin) |
| Health | `/api/health` | Kiểm tra backend còn sống (public) |

### Ví dụ gọi API

**Đăng nhập:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "tendangnhap": "admin",
  "matkhau": "admin123"
}
```

Response (rút gọn):

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "type": "Bearer",
    "nguoidungId": 1,
    "tendangnhap": "admin",
    "hoten": "Quản trị viên",
    "vaitro": "ADMIN",
    "quyenhan": []
  }
}
```

**Lấy danh sách tài sản:**

```http
GET /api/tai-san
Authorization: Bearer <token>
```

**Lấy QR code của tài sản:**

```http
GET /api/tai-san/{id}/qrcode
Authorization: Bearer <token>
```

## 🧪 Testing

```bash
# Backend
cd backend
.\mvnw.cmd test

# Build nhanh, bỏ qua test
.\mvnw.cmd clean package -DskipTests

# Frontend
cd frontend
npm run build
npm run preview
```

### Test camera/QR trên điện thoại

Camera chỉ hoạt động trên `localhost` hoặc HTTPS. Cách đơn giản nhất là dùng bản đã deploy:

```
https://trannhutthien.github.io/quanlytaisan/
```

Nếu test local, có thể dùng ngrok:

```bash
ngrok http 5173
```

## ☁️ Triển khai

### Quy trình tổng quát

```
push lên nhánh main
   ├── GitHub Actions build frontend → deploy GitHub Pages
   └── Render tự build Docker backend → deploy Web Service
```

### Frontend – GitHub Pages

- Repo: **Settings → Pages → Source: GitHub Actions**.
- Workflow: `.github/workflows/deploy.yml`, chạy khi push `main` hoặc chạy tay.
- Biến build: **Settings → Secrets and variables → Actions → Variables**
  - `VITE_API_URL = https://<tên-dịch-vụ>.onrender.com/api`
- `vite.config.js` dùng `base: '/quanlytaisan/'` khớp tên repo.
- Ứng dụng dùng `HashRouter` nên refresh trang con không bị 404 trên Pages.
- Sau khi đổi `VITE_API_URL` phải chạy lại workflow vì biến được nhúng lúc build.

### Backend – Render

1. **New → Web Service**, chọn repo `trannhutthien/quanlytaisan`.
2. Cấu hình:
   - Language: **Docker**
   - Root Directory: `backend`
   - Region: **Singapore**
   - Instance Type: **Free**
   - Health Check Path: `/api/health`
3. Khai báo Environment Variables:

| Key | Giá trị |
|-----|---------|
| `DB_URL` | `jdbc:mysql://<TIDB_HOST>:4000/quanlytaisanqr?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3` |
| `DB_USERNAME` | `<user TiDB>.root` |
| `DB_PASSWORD` | `<mật khẩu TiDB>` |
| `JWT_SECRET` | chuỗi ngẫu nhiên tối thiểu 32 ký tự |
| `CORS_ALLOWED_ORIGINS` | `https://trannhutthien.github.io` |
| `QR_BASE_URL` | `https://trannhutthien.github.io/quanlytaisan/#/assets/` |
| `DDL_AUTO` | `update` lần đầu, sau đó đổi thành `validate` |

4. Kiểm tra: `https://<tên-dịch-vụ>.onrender.com/api/health` trả về `OK`.

### Database – TiDB Cloud

- Tạo cluster Serverless, database `quanlytaisanqr`.
- Kết nối qua cổng **4000** kèm `sslMode=VERIFY_IDENTITY`.
- Render không có IP tĩnh: nếu TiDB bật IP Access List, cần cho phép truy cập từ mọi IP và dùng mật khẩu mạnh.
- Import schema từ `backend/src/main/resources/db/quanlytaisanqr_gon.sql` nếu database còn trống.

### Lưu ý vận hành

- Render Free ngủ sau 15 phút; có thể gọi `/api/health` mỗi 10 phút bằng cron-job.org trước buổi demo.
- Đổi `DDL_AUTO` sang `validate` sau khi schema ổn định.
- Sao lưu database định kỳ trước các buổi báo cáo.

## 🔒 Bảo mật

- **Không commit** các file chứa thông tin thật:
  - `backend/src/main/resources/application-local.yml`
  - `backend/src/main/resources/application-tidb.yml`
  - `backend/src/main/resources/application-prod.yml`
  - `frontend/.env`, `.env.local`, `.env.production`
- Tất cả bí mật (`DB_PASSWORD`, `JWT_SECRET`, ...) chỉ đặt trong Environment Variables của Render.
- `CORS_ALLOWED_ORIGINS` chỉ khai báo đúng origin frontend, không dùng `*`.
- Nếu thông tin database/JWT từng bị commit hoặc chia sẻ công khai, hãy **đổi mật khẩu/khóa ngay** và cập nhật lại Render.
- Đổi mật khẩu tài khoản admin mặc định trước khi dùng thật.

## 📖 Tài liệu

Thư mục [`docx/`](docx) chứa:

- Hướng dẫn đưa frontend lên GitHub Pages.
- Hướng dẫn đưa backend Spring Boot lên Render.
- Danh sách chức năng và sơ đồ dự án.
- Báo cáo tiến độ.

## 📧 Liên hệ

- **GitHub**: [trannhutthien/quanlytaisan](https://github.com/trannhutthien/quanlytaisan)
- **Issues**: [github.com/trannhutthien/quanlytaisan/issues](https://github.com/trannhutthien/quanlytaisan/issues)

---

**Đồ án tốt nghiệp – TVU**
