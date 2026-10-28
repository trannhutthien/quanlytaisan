# Hướng dẫn Đóng góp

Cảm ơn bạn quan tâm đến việc đóng góp cho dự án! Vui lòng đọc hướng dẫn này trước khi bắt đầu.

## Quy trình Đóng góp

1. **Fork** repository
2. **Clone** fork của bạn về máy:
   ```bash
   git clone https://github.com/YOUR_USERNAME/quanlytaisan-qr.git
   cd quanlytaisan-qr
   ```
3. **Tạo branch** mới cho tính năng/bugfix:
   ```bash
   git checkout -b feature/ten-tinh-nang
   # hoặc
   git checkout -b bugfix/ten-loi
   ```
4. **Commit** thay đổi với message rõ ràng
5. **Push** lên fork của bạn:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
6. Tạo **Pull Request** về repository chính

## Quy tắc Commit Message

Sử dụng format:

```
<type>(<scope>): <subject>

<body>
```

**Type:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật tài liệu
- `style`: Format code (không thay đổi logic)
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Các task khác (build, config, v.v.)

**Ví dụ:**
```
feat(taisan): thêm chức năng export Excel

- Thêm button export trong TaiSanList
- Implement API endpoint /api/taisan/export
- Sử dụng Apache POI cho Excel generation
```

## Code Style

### Backend (Java)
- Sử dụng **4 spaces** cho indentation
- Package naming: `com.tvu.quanlytaisan.<module>`
- Class naming: **PascalCase**
- Method/variable naming: **camelCase**
- Constants: **UPPER_SNAKE_CASE**

### Frontend (JavaScript/React)
- Sử dụng **2 spaces** cho indentation
- Component naming: **PascalCase** (VD: `TaiSanList.jsx`)
- File/folder naming: **lowercase** (VD: `taisan/`, `useAuth.js`)
- Function/variable naming: **camelCase**
- Constants: **UPPER_SNAKE_CASE**

## Quy tắc Đặt tên

### Backend
```java
// Entity
public class TaiSan { }

// Repository
public interface TaiSanRepository extends JpaRepository<TaiSan, Long> { }

// Service
public class TaiSanService { }

// Controller
@RestController
@RequestMapping("/api/taisan")
public class TaiSanController { }

// DTO
public class TaiSanRequest { }
public class TaiSanResponse { }
```

### Frontend
```javascript
// Component
const TaiSanList = () => { }

// Hook
const useAuth = () => { }

// API
const taisanApi = { }

// Constants
const TRANG_THAI_TAI_SAN = { }
```

## Testing

### Backend
```bash
cd backend
mvn test
```

Viết unit test cho:
- Service layer
- Controller layer (integration tests)

### Frontend
```bash
cd frontend
npm test
```

## Pull Request Checklist

Trước khi tạo PR, đảm bảo:

- [ ] Code chạy được và không có lỗi
- [ ] Đã test thủ công tính năng mới
- [ ] Đã viết/cập nhật tests (nếu cần)
- [ ] Đã cập nhật documentation (nếu cần)
- [ ] Commit messages rõ ràng và đúng format
- [ ] Không có conflict với branch main
- [ ] Đã review code của chính mình
- [ ] **KHÔNG** commit file config nhạy cảm (.env, application-prod.yml, v.v.)

## Code Review

Khi review PR của người khác:

1. **Kiểm tra logic:** Code có đúng logic và đầy đủ không?
2. **Kiểm tra style:** Code có tuân thủ style guide không?
3. **Kiểm tra performance:** Có vấn đề về hiệu năng không?
4. **Kiểm tra security:** Có lỗ hổng bảo mật không?
5. **Kiểm tra tests:** Tests có cover đủ cases không?

## Báo cáo Lỗi (Bug Report)

Khi tạo issue báo lỗi, bao gồm:

1. **Mô tả:** Lỗi là gì?
2. **Các bước tái hiện:**
   - Bước 1: ...
   - Bước 2: ...
   - Bước 3: ...
3. **Kết quả thực tế:** Điều gì đã xảy ra?
4. **Kết quả mong đợi:** Điều gì nên xảy ra?
5. **Screenshots:** (nếu có)
6. **Môi trường:**
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/Safari
   - Version: ...

## Đề xuất Tính năng (Feature Request)

Khi tạo issue đề xuất tính năng, bao gồm:

1. **Vấn đề:** Tính năng này giải quyết vấn đề gì?
2. **Giải pháp đề xuất:** Tính năng hoạt động như thế nào?
3. **Lợi ích:** Tại sao nên thêm tính năng này?
4. **Mockups:** (nếu có)

## Questions?

Nếu có câu hỏi, tạo issue với label `question` hoặc liên hệ qua [thêm thông tin liên hệ].

---

Cảm ơn bạn đã đóng góp! 🎉
