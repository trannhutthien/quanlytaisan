# Hệ thống Quản lý Tài sản bằng mã QR

Hệ thống quản lý tài sản sử dụng mã QR để tra cứu, kiểm kê và bảo trì tài sản.

## Công nghệ sử dụng

### Backend
- Java 17
- Spring Boot 3.x
- MySQL 8.x
- JWT Authentication
- ZXing (QR Code generation)

### Frontend
- ReactJS 18
- Vite
- Ant Design 5
- html5-qrcode (QR Scanner)
- Recharts (Charts)

## Cấu trúc dự án

```
.
├── backend/          # Spring Boot API
├── frontend/         # React SPA
├── docx/            # Tài liệu dự án
├── SECURITY.md      # Hướng dẫn bảo mật
└── README.md        # File này
```

## Cài đặt và Chạy dự án

### Yêu cầu

- **Node.js** 20 LTS hoặc cao hơn
- **Java** 17 hoặc cao hơn
- **Maven** 3.8+
- **MySQL** 8.0+

### 1. Setup Database

```bash
# Tạo database
mysql -u root -p
CREATE DATABASE quanlytaisanqr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p quanlytaisanqr < backend/src/main/resources/db/quanlytaisanqr_gon.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy file config mẫu (nếu có)
# cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml

# Cấu hình database trong application-dev.yml:
# spring.datasource.url=jdbc:mysql://localhost:3306/quanlytaisanqr
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build và chạy
mvn clean install
mvn spring-boot:run

# Hoặc chạy file JAR
java -jar target/quanlytaisan-0.0.1-SNAPSHOT.jar
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Cài đặt dependencies
npm install

# Copy file .env
cp .env.example .env

# Kiểm tra file .env có đúng API URL:
# VITE_API_URL=http://localhost:8080/api

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Tài khoản mặc định

Sau khi import database, sử dụng tài khoản:

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **User**: 
  - Username: `user`
  - Password: `user123`

⚠️ **LƯU Ý:** Đổi password mặc định sau khi cài đặt!

## Tính năng chính

- ✅ Đăng nhập và phân quyền (ADMIN/USER)
- ✅ Quản lý tài sản (CRUD)
- ✅ Sinh mã QR tự động cho tài sản
- ✅ Quét QR bằng camera điện thoại
- ✅ Quản lý luân chuyển (Bàn giao, Thu hồi, Điều chuyển)
- ✅ Quản lý bảo trì và báo hỏng
- ✅ Kiểm kê tài sản định kỳ
- ✅ Dashboard thống kê
- ✅ Quản lý danh mục (Đơn vị, Vị trí, Loại tài sản)
- ✅ Quản lý người dùng

## Phát triển

### Backend
Xem chi tiết: [backend/README.md](backend/README.md)

### Frontend
Xem chi tiết: [frontend/README.md](frontend/README.md)

## Bảo mật

⚠️ **QUAN TRỌNG:** Đọc [SECURITY.md](SECURITY.md) trước khi push code lên Git!

### Checklist trước khi push lần đầu:
- [ ] Không commit file `.env`
- [ ] Không commit file `application-*-local.yml` hoặc `application-*-prod.yml`
- [ ] Không có password/API key trong code
- [ ] Đã tạo `.env.example` và `application.yml.example`

## Testing trên thiết bị di động

### Dùng cùng mạng WiFi:

1. Kiểm tra IP máy tính:
   ```bash
   # Windows
   ipconfig
   # Linux/Mac
   ifconfig
   ```

2. Frontend đã cấu hình `host: true` trong `vite.config.js`

3. Truy cập từ điện thoại: `http://YOUR_IP:5173`

### Camera và HTTPS:

Camera chỉ hoạt động trên:
- `localhost` (khi dev)
- HTTPS domains (khi deploy)

Để test camera trên điện thoại thật, deploy với HTTPS hoặc dùng **ngrok**:

```bash
# Cài ngrok
npm install -g ngrok

# Tạo tunnel HTTPS
ngrok http 5173
```

## Deployment

### Backend (Spring Boot)

```bash
cd backend
mvn clean package -DskipTests
java -jar target/quanlytaisan-0.0.1-SNAPSHOT.jar
```

### Frontend (React)

```bash
cd frontend
npm run build
# Deploy thư mục dist/ lên web server
```

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/TinhNangMoi`)
3. Commit changes (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## License

[Thêm license của bạn]

## Liên hệ

[Thêm thông tin liên hệ]
