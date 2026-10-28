# Hướng dẫn Bảo mật

## ⚠️ QUAN TRỌNG: Trước khi push lên GitHub

### 1. Kiểm tra file `.env` và config

**KHÔNG BAO GIỜ** push các file sau lên Git:

#### Frontend
- ❌ `.env` (chứa API URL, có thể có API keys)
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ Bất kỳ file có chứa token, API key, hoặc thông tin nhạy cảm

#### Backend
- ❌ `application-local.yml` (thông tin database local)
- ❌ `application-prod.yml` (thông tin database production)
- ❌ Bất kỳ file config có password database
- ❌ File chứa JWT secret key
- ❌ File chứa thông tin SMTP/email

### 2. File đã được bảo vệ bởi `.gitignore`

✅ Frontend:
- `node_modules/`
- `.env*`
- `dist/`
- Các file log

✅ Backend:
- `target/`
- `application-*-local.yml`
- `application-*-prod.yml`
- Các file log

### 3. Thông tin nhạy cảm KHÔNG được commit

**Các loại thông tin cần bảo vệ:**
- 🔐 Database username/password
- 🔐 JWT secret key
- 🔐 API keys (Google, AWS, v.v.)
- 🔐 SMTP credentials
- 🔐 OAuth client ID/secret
- 🔐 Production URLs và IPs
- 🔐 Bất kỳ thông tin cá nhân (PII)

### 4. Cách sử dụng file config an toàn

#### Frontend - Tạo `.env.example`

```bash
# Copy file này thành .env và điền thông tin thật
VITE_API_URL=http://localhost:8080/api
```

Push `.env.example` lên Git, KHÔNG push `.env` thật.

#### Backend - Tạo `application.yml.example`

```yaml
# Copy file này và đổi tên:
# - application-dev.yml (local development)
# - application-prod.yml (production)

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/database_name
    username: your_username
    password: your_password
  
jwt:
  secret: your-secret-key-here
  expiration: 86400000
```

Push `.example` files, KHÔNG push file config thật.

### 5. Kiểm tra trước khi commit

Chạy lệnh này để xem file nào sẽ được commit:

```bash
git status
git diff
```

Nếu thấy file nhạy cảm, thêm vào `.gitignore` ngay:

```bash
echo "file-nham-cam.yml" >> .gitignore
git rm --cached file-nham-cam.yml  # Xóa khỏi staging area
```

### 6. Nếu đã vô tình commit thông tin nhạy cảm

**CẢNH BÁO:** Nếu đã push thông tin nhạy cảm lên GitHub:

1. **ĐỔI NGAY** tất cả passwords, API keys, secrets
2. Xóa file khỏi Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH/TO/FILE" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push:
   ```bash
   git push origin --force --all
   ```
4. Thông báo cho team về việc đổi credentials

**LƯU Ý:** Việc xóa khỏi history rất phức tạp. Tốt nhất là **NGĂN CHẶN** từ đầu.

### 7. GitHub Security Features

Khi push lên GitHub:

- ✅ Bật **Secret scanning** trong repository settings
- ✅ Bật **Dependabot alerts** để cảnh báo dependencies lỗi bảo mật
- ✅ Sử dụng GitHub Secrets cho CI/CD (nếu có)
- ✅ Không commit trực tiếp vào `main`, dùng pull requests

### 8. Production Deployment

Khi deploy production:

- ✅ Sử dụng environment variables của hosting platform (Heroku, Vercel, AWS, v.v.)
- ✅ KHÔNG hardcode production credentials trong code
- ✅ Sử dụng secrets management service (AWS Secrets Manager, HashiCorp Vault)
- ✅ Enable HTTPS cho production
- ✅ Thường xuyên rotate passwords và API keys

### 9. Checklist trước khi push lần đầu

- [ ] Đã kiểm tra không có password trong code
- [ ] Đã kiểm tra `.gitignore` cho frontend
- [ ] Đã kiểm tra `.gitignore` cho backend
- [ ] Đã tạo `.env.example` thay vì `.env` thật
- [ ] Đã tạo `application.yml.example` thay vì config thật
- [ ] Đã chạy `git status` để xem file nào sẽ được commit
- [ ] Đã review toàn bộ file SQL dump (nếu có) để loại bỏ data nhạy cảm
- [ ] README.md không chứa thông tin nhạy cảm

### 10. Contact Security Issues

Nếu phát hiện lỗ hổng bảo mật trong dự án này, vui lòng báo cáo riêng qua email thay vì tạo public issue.

---

**Nhớ:** Bảo mật là trách nhiệm của mọi người. Khi nghi ngờ, hãy hỏi trước khi push!
