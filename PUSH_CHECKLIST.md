# ✅ Checklist trước khi Push lên GitHub

## 🔒 Bảo mật - ĐÃ HOÀN TẤT

### Files KHÔNG được push (đã được gitignore)
- ❌ `frontend/.env` - Chứa API URL và có thể có API keys
- ❌ `backend/src/main/resources/application.yml` - Chứa DB password và JWT secret
- ❌ `backend/src/main/resources/application-dev.yml` - Chứa DB credentials
- ❌ `node_modules/` - Dependencies (quá lớn)
- ❌ `target/` - Build files

### Files ĐÃ được tạo để replace (an toàn)
- ✅ `frontend/.env.example` - Template không có thông tin nhạy cảm
- ✅ `backend/src/main/resources/application.yml.example` - Template
- ✅ `backend/src/main/resources/application-dev.yml.example` - Template

### Files .gitignore đã được cấu hình
- ✅ `.gitignore` (root)
- ✅ `frontend/.gitignore`
- ✅ `backend/.gitignore`

## 📋 Files sẽ được push

### Root Level
- ✅ `.gitignore`
- ✅ `README.md` - Hướng dẫn tổng quan
- ✅ `SECURITY.md` - Hướng dẫn bảo mật
- ✅ `CONTRIBUTING.md` - Hướng dẫn đóng góp

### Backend
- ✅ Java source code (entities, enums)
- ✅ `pom.xml`
- ✅ `backend/README.md`
- ✅ Config examples (*.example)
- ✅ SQL script

### Frontend
- ✅ React source code (components, pages, hooks, etc.)
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `.env.example`
- ✅ `frontend/README.md`

### Documentation
- ✅ `docx/` folder với tài liệu dự án

## 🚀 Cách setup cho người khác sau khi clone

### Họ cần làm gì?

1. **Clone repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quanlytaisan-qr.git
   cd quanlytaisan-qr
   ```

2. **Backend setup:**
   ```bash
   cd backend/src/main/resources
   
   # Copy và điền thông tin thật
   cp application.yml.example application.yml
   cp application-dev.yml.example application-dev.yml
   
   # Sửa file application.yml:
   # - Đổi database username/password
   # - Đổi JWT secret thành chuỗi mạnh
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   
   # Copy và điền thông tin thật
   cp .env.example .env
   
   # Sửa file .env nếu cần:
   # VITE_API_URL=http://localhost:8080/api
   ```

4. **Database setup:**
   ```bash
   mysql -u root -p
   CREATE DATABASE quanlytaisanqr;
   USE quanlytaisanqr;
   SOURCE backend/src/main/resources/db/quanlytaisanqr_gon.sql;
   ```

5. **Run backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

6. **Run frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ⚠️ LƯU Ý QUAN TRỌNG

### Các file KHÔNG BAO GIỜ commit:
- Bất kỳ file có chứa password thật
- Bất kỳ file có chứa API keys
- Bất kỳ file có chứa JWT secrets
- File `.env` (chỉ commit `.env.example`)
- File `application.yml` (chỉ commit `.example`)
- File có thông tin production

### Nếu cần thêm config mới:
1. Thêm vào file `.example`
2. Dùng placeholder values (không phải giá trị thật)
3. Document trong README
4. KHÔNG commit file config thật

### Trước mỗi lần commit:
```bash
# Kiểm tra file nào sẽ được commit
git status

# Review changes
git diff

# Đảm bảo không có password/secret
grep -r "password" --include="*.yml" --include="*.env"
```

## ✨ Bạn đã sẵn sàng push!

Dự án đã được cấu hình an toàn. Bạn có thể push lên GitHub:

```bash
git commit -m "Initial commit: Setup project structure"
git remote add origin https://github.com/YOUR_USERNAME/quanlytaisan-qr.git
git push -u origin master
```

---

**Đã kiểm tra:** ✅ Không có thông tin nhạy cảm trong staging area
**An toàn để push:** ✅ CÓ
**Date checked:** $(date)
