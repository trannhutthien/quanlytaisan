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
- **Java** 17 (LTS - Khuyến nghị, **BẮT BUỘC dùng Java 17**, không dùng Java 25)
- **Maven** 3.8+ (hoặc dùng Maven Wrapper `mvnw.cmd` có sẵn)
- **MySQL** 8.0+

> ⚠️ **LƯU Ý JAVA:** Dự án sử dụng Lombok và Spring Boot 3.3.5, **YÊU CẦU Java 17**. Nếu bạn đang dùng Java 25 sẽ gặp lỗi biên dịch. Xem hướng dẫn cài đặt Java 17 tại [HUONG_DAN_SUA_LOI_LOMBOK.md](HUONG_DAN_SUA_LOI_LOMBOK.md)

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

# Kiểm tra Java version (phải là Java 17)
java -version

# Nếu thấy Java 25, xem hướng dẫn đổi về Java 17: HUONG_DAN_SUA_LOI_LOMBOK.md

# Copy file config mẫu (nếu cần)
# cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml

# Cấu hình database trong application.yml hoặc application-dev.yml:
# spring.datasource.url=jdbc:mysql://localhost:3306/quanlytaisanqr
# spring.datasource.username=root
# spring.datasource.password=your_password

# Build và chạy bằng Maven Wrapper (khuyến nghị)
.\mvnw.cmd clean install -DskipTests
.\mvnw.cmd spring-boot:run

# Hoặc dùng Maven nếu đã cài
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080/api`

**API Documentation (Swagger):** `http://localhost:8080/api/swagger-ui.html`

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

Sau khi import database và khởi động backend, hệ thống tự động tạo 2 tài khoản mặc định:

### 👤 Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Vai trò:** ADMIN (toàn quyền)

### 👤 User Account  
- **Username:** `user`
- **Password:** `user123`
- **Vai trò:** USER (quyền hạn chế)

⚠️ **LƯU Ý BẢO MẬT:** 
- Đổi password ngay sau khi đăng nhập lần đầu!
- Không sử dụng tài khoản mặc định trong môi trường production
- Xem thêm hướng dẫn bảo mật tại [SECURITY.md](SECURITY.md)

💡 **Cách đổi password:** Đăng nhập → Menu Profile → Đổi mật khẩu

## Hướng dẫn chi tiết

- 📖 **Hướng dẫn chạy ứng dụng:** [HUONG_DAN_CHAY_UNG_DUNG.md](HUONG_DAN_CHAY_UNG_DUNG.md)
- 🔧 **Hướng dẫn sửa lỗi Java/Lombok:** [HUONG_DAN_SUA_LOI_LOMBOK.md](HUONG_DAN_SUA_LOI_LOMBOK.md)
- 🔒 **Hướng dẫn bảo mật:** [SECURITY.md](SECURITY.md)
- 📋 **Kế hoạch phát triển:** [docx/Danh sách xây dựng chức năng.md](docx/Danh%20sách%20xây%20dựng%20chức%20năng%20–%20Hệ%20thống%20quản%20lý%20tài%20sản%20bằng%20mã%20QR.md)

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
