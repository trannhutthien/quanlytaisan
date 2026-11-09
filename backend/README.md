# Backend – Hệ thống Quản lý Tài sản bằng mã QR

API backend cho hệ thống quản lý tài sản bằng mã QR, viết bằng Spring Boot 3.3.5 / Java 17.

- **API production**: https://quanlytaisan-6hhw.onrender.com/api
- **Health check**: https://quanlytaisan-6hhw.onrender.com/api/health
- **Repository**: https://github.com/trannhutthien/quanlytaisan

## Công nghệ sử dụng

| Nhóm | Công nghệ |
|------|-----------|
| Ngôn ngữ / Framework | Java 17, Spring Boot 3.3.5 |
| Bảo mật | Spring Security + JWT (JJWT 0.12.6) |
| Dữ liệu | Spring Data JPA, Hibernate, MySQL Connector/J 8.2.0 |
| Validation | Spring Validation |
| QR Code | ZXing 3.5.3 |
| Excel | Apache POI 5.3.0 |
| API docs | Springdoc OpenAPI 2.6.0 |
| Build | Maven (Maven Wrapper) |
| Đóng gói | Docker multi-stage (Maven 3.9 + JRE 17) |

Database chạy local dùng MySQL 8; môi trường production dùng **TiDB Cloud Serverless** (tương thích MySQL, cổng 4000, SSL).

## Yêu cầu

- JDK 17 (bắt buộc)
- Maven 3.9+ hoặc dùng `mvnw.cmd` / `mvnw`
- MySQL 8 (local) hoặc TiDB Cloud
- Docker (tùy chọn, để build image)

## Cấu hình

`src/main/resources/application.yml` đọc toàn bộ cấu hình quan trọng từ biến môi trường:

| Biến | Mặc định local | Ghi chú |
|------|----------------|---------|
| `PORT` | `8080` | Render cấp tự động |
| `DB_URL` | MySQL `localhost:3306/quanlytaisanqr` | Production: TiDB cổng 4000 + SSL |
| `DB_USERNAME` | `root` | |
| `DB_PASSWORD` | rỗng | |
| `DDL_AUTO` | `none` | Lần đầu deploy dùng `update`, sau đó `validate` |
| `JWT_SECRET` | giá trị mẫu | Tối thiểu 32 ký tự khi deploy |
| `JWT_EXPIRATION` | `86400000` | 24 giờ |
| `CORS_ALLOWED_ORIGINS` | các origin localhost | Production: `https://trannhutthien.github.io` |
| `QR_BASE_URL` | `http://localhost:5173/#/assets/` | Production: `https://trannhutthien.github.io/quanlytaisan/#/assets/` |

Có thể tạo file `application-local.yml` hoặc `application-tidb.yml` để override khi chạy local — các file này đã nằm trong `.gitignore`, **không commit** thông tin kết nối thật.

## Chạy local

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend chạy tại `http://localhost:8080/api`, kiểm tra:

```bash
curl http://localhost:8080/api/health
# OK
```

## Build

```bash
.\mvnw.cmd clean package -DskipTests
# JAR: target/quanlytaisan-1.0.0.jar
```

## Docker và Render

`Dockerfile` ở thư mục backend build bằng Maven rồi chạy trên JRE 17, giới hạn heap bằng `JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70"`.

Trên Render:

1. New → Web Service → chọn repo `trannhutthien/quanlytaisan`.
2. Language: **Docker**, Root Directory: `backend`, Region: **Singapore**, Instance Type: **Free**.
3. Health Check Path: `/api/health`.
4. Khai báo các biến môi trường như bảng trên.

Chi tiết đầy đủ xem tại [README gốc](../README.md).

## API

- Swagger UI (khi bật public trong `SecurityConfig`): `http://localhost:8080/api/swagger-ui.html`
- Đăng nhập: `POST /api/auth/login` với body `{ "tendangnhap": "admin", "matkhau": "admin123" }`.
- Các module: `/auth`, `/tai-san`, `/luanchuyen`, `/bao-tri`, `/kiem-ke`, `/thongke`, `/don-vi`, `/vi-tri`, `/loai-tai-san`, `/trang-thai-tai-san`, `/nguoidung`, `/health`.

## Phân quyền

- **ADMIN**: toàn quyền quản lý hệ thống.
- **USER**: xem tài sản, quét QR, báo hỏng.

## Cấu trúc thư mục

```
backend/
├── Dockerfile
├── .dockerignore
├── pom.xml
├── mvnw, mvnw.cmd
└── src/main/
    ├── java/com/tvu/quanlytaisan/
    │   ├── config/        # Security, CORS, DataInitializer
    │   ├── controller/    # REST Controllers + HealthController
    │   ├── dto/           # request/ + response/
    │   ├── entity/        # JPA Entities
    │   ├── enums/
    │   ├── exception/
    │   ├── repository/
    │   ├── security/      # JWT
    │   └── service/       # Business Logic, QRCodeService
    └── resources/
        ├── application.yml
        ├── application-*.yml.example
        └── db/            # schema + dữ liệu mẫu
```

## Testing

```bash
.\mvnw.cmd test
```
