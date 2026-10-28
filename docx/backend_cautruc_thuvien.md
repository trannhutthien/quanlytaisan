# BACKEND – HỆ THỐNG QUẢN LÝ TÀI SẢN BẰNG MÃ QR

Tài liệu mô tả cấu trúc thư mục, thư viện và quy ước cho phần backend. Dùng để giao cho trợ lý AI hoặc tham khảo khi tạo dự án.

## 1. Lựa chọn công nghệ

| Hạng mục | Lựa chọn |
|---|---|
| Ngôn ngữ | Java 17 (lập trình hướng đối tượng) |
| Framework | Spring Boot 3.x, xây dựng RESTful API |
| Quản lý thư viện | Maven |
| Cơ sở dữ liệu | MySQL 8.x, database `quanlytaisanqr` (script `quanlytaisanqr_gon.sql`) |
| Truy cập dữ liệu | Spring Data JPA (Hibernate) |
| Xác thực, phân quyền | Spring Security + JWT, 2 vai trò: ADMIN và USER |
| Mã QR | ZXing (chuẩn ISO/IEC 18004) |
| Tài liệu API | springdoc-openapi (Swagger UI) |

## 2. Công cụ cần cài trên máy

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| JDK | 17 | Đặt biến môi trường `JAVA_HOME` |
| Maven | 3.9+ | Có thể bỏ qua nếu dùng `mvnw` đi kèm dự án |
| MySQL | 8.x | Chạy script SQL trước khi chạy backend |
| IntelliJ IDEA | Community là đủ | Hoặc VS Code + Extension Pack for Java |
| Postman | Bản mới | Thử API, có thể dùng Swagger thay thế |

## 3. Khởi tạo dự án

Vào https://start.spring.io và chọn:

- Project: Maven, Language: Java, Spring Boot: bản 3.x ổn định mới nhất, Java: 17
- Group: `com.tvu`, Artifact: `quanlytaisan`, Packaging: Jar
- Dependencies: Spring Web, Spring Data JPA, MySQL Driver, Spring Security, Validation, Lombok

## 4. Thư viện bổ sung trong `pom.xml`

Các thư viện dưới đây không có sẵn trên Spring Initializr, cần thêm tay vào thẻ `<dependencies>`:

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>

<!-- Sinh mã QR -->
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.5.3</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.5.3</version>
</dependency>

<!-- Swagger UI -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>

<!-- Xuất báo cáo Excel (tùy chọn, chỉ thêm nếu làm tính năng này) -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.3.0</version>
</dependency>
```

Lưu ý: phiên bản trên là gợi ý, nên kiểm tra lại bản tương thích với phiên bản Spring Boot đang dùng.

## 5. Cấu trúc thư mục

```
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/tvu/quanlytaisan/
    │   │   ├── QuanlytaisanApplication.java
    │   │   ├── config/
    │   │   ├── security/
    │   │   ├── entity/
    │   │   ├── enums/
    │   │   ├── repository/
    │   │   ├── dto/
    │   │   │   ├── request/
    │   │   │   └── response/
    │   │   ├── mapper/
    │   │   ├── service/
    │   │   ├── controller/
    │   │   ├── exception/
    │   │   └── util/
    │   └── resources/
    │       ├── application.yml
    │       ├── application-dev.yml
    │       └── db/
    │           └── quanlytaisanqr_gon.sql
    └── test/java/com/tvu/quanlytaisan/
```

Lệnh tạo nhanh các thư mục (chạy trong thư mục gốc dự án, bằng Git Bash, macOS hoặc Linux):

```bash
cd src/main/java/com/tvu/quanlytaisan
mkdir config security entity enums repository mapper service controller exception util
mkdir -p dto/request dto/response
cd -
mkdir -p src/main/resources/db
```

## 6. Nội dung từng thư mục

| Thư mục | Nội dung |
|---|---|
| `config` | `SecurityConfig` (luật phân quyền), `CorsConfig` (cho phép frontend gọi API), `OpenApiConfig` (Swagger) |
| `security` | `JwtService`, `JwtAuthFilter`, `UserDetailsServiceImpl` |
| `entity` | 13 lớp ứng với 13 bảng: `VaiTro`, `DonVi`, `NguoiDung`, `ViTri`, `LoaiTaiSan`, `TrangThaiTaiSan`, `TaiSan`, `LichSuQuet`, `LuanChuyen`, `BaoTri`, `LichSuTrangThai`, `DotKiemKe`, `ChiTietKiemKe` |
| `enums` | `LoaiPhieu`, `LoaiBaoTri`, `TrangThaiXuLy`, `TrangThaiDotKiemKe`, `KetQuaKiemKe` |
| `repository` | Mỗi entity một interface kế thừa `JpaRepository`, ví dụ `TaiSanRepository` |
| `dto/request` | Dữ liệu client gửi lên, ví dụ `TaiSanRequest`, `DangNhapRequest` |
| `dto/response` | Dữ liệu trả về, ví dụ `TaiSanResponse`, `ThongKeResponse` |
| `mapper` | Chuyển đổi giữa entity và dto |
| `service` | Xử lý nghiệp vụ: bàn giao, đổi trạng thái, kiểm kê |
| `controller` | Các endpoint REST (xem mục 7) |
| `exception` | `GlobalExceptionHandler` và các lỗi tự định nghĩa như `KhongTimThayException` |
| `util` | `QrCodeUtil` (sinh ảnh QR bằng ZXing) |
| `resources/db` | Lưu script SQL cùng dự án |

## 7. Danh sách controller

| Controller | Nhiệm vụ |
|---|---|
| `AuthController` | Đăng nhập, lấy thông tin người dùng hiện tại |
| `TaiSanController` | CRUD, tìm kiếm, lọc tài sản; trả ảnh QR (PNG); tra cứu theo `taisan_id` |
| `LuanChuyenController` | Bàn giao, thu hồi, điều chuyển |
| `BaoTriController` | Báo hỏng, cập nhật tiến trình sửa chữa, bảo trì định kỳ |
| `KiemKeController` | Tạo đợt kiểm kê, ghi nhận kết quả sau khi quét QR |
| `ThongKeController` | Số liệu dashboard và báo cáo |
| `NguoiDungController` | Quản lý người dùng (chỉ ADMIN) |
| `DanhMucController` | Quản lý đơn vị, vị trí, loại tài sản |

## 8. Cấu hình `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/quanlytaisanqr?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Ho_Chi_Minh
    username: root
    password: <mật khẩu MySQL>
  jpa:
    hibernate:
      ddl-auto: none        # không để Hibernate tự sửa bảng
    open-in-view: false
server:
  port: 8080
```

## 9. Quy ước bắt buộc

1. **Tên bảng, cột bằng tiếng Việt không dấu.** Tên lớp Java đặt theo chuẩn (`TaiSan`, `NguoiDung`), nhưng mọi trường phải khai báo `@Table(name = "taisan")` và `@Column(name = "taisan_id")`. Không được để Spring tự đổi tên, vì mặc định sẽ chuyển sang `snake_case` và không khớp CSDL.
2. **Không để Hibernate tự tạo hoặc sửa bảng:** `ddl-auto: none`.
3. **Phân lớp:** `controller → service → repository → entity`. Controller không chứa logic nghiệp vụ và không trả thẳng entity ra ngoài, luôn qua DTO.
4. **Cập nhật hai nơi trong một transaction:** khi bàn giao hoặc đổi trạng thái, service phải cập nhật `taisan` và ghi thêm `luanchuyen` hoặc `lichsutrangthai`, đánh dấu `@Transactional`.
5. **Mã QR:** không lưu trong CSDL. Backend sinh ảnh khi cần từ chuỗi `https://domain.com/assets/{taisan_id}`.
6. **Xóa tài sản:** xóa mềm bằng cột `daxoa`, không xóa hẳn dòng.
7. **Mật khẩu:** mã hóa bằng BCrypt trước khi lưu vào cột `matkhaumahoa`.
8. **Phân quyền:** ADMIN thêm, sửa, xóa mọi thứ; USER chỉ xem, quét QR và báo hỏng.
9. **Trạng thái tài sản:** bốn mã bắt buộc `IN_USE`, `AVAILABLE`, `MAINTENANCE`, `BROKEN` (bảng `trangthaitaisan`).

## 10. Thứ tự thực hiện gợi ý

1. Tạo dự án, cấu hình kết nối MySQL, chạy được ứng dụng.
2. Viết 13 entity khớp đúng tên bảng, cột.
3. Đăng nhập, JWT và phân quyền.
4. Danh mục: đơn vị, vị trí, loại tài sản.
5. CRUD tài sản và sinh ảnh QR.
6. API tra cứu tài sản theo `taisan_id` (dùng cho trang sau khi quét QR).
7. Luân chuyển (bàn giao, thu hồi).
8. Bảo trì và sửa chữa.
9. Kiểm kê.
10. Thống kê cho dashboard.

Sau mỗi bước, ứng dụng phải chạy được và thử được bằng Swagger hoặc Postman.
