# Bugfix Requirements Document

## Introduction

Người dùng với quyền admin không thể nhìn thấy button "Thêm loại tài sản" và các tính năng admin khác trong giao diện page "Loại Tài Sản". Nguyên nhân là sự không khớp tên field giữa backend và frontend:
- Backend trả về field `vaitro` (viết thường không dấu)
- Frontend kiểm tra `user.vaiTro` (viết hoa chữ T)

Do đó, điều kiện kiểm tra quyền admin luôn fail, khiến `AdminRoute` chuyển hướng user đi nơi khác và các component không render button/tính năng dành cho admin.

**Phạm vi ảnh hưởng:**
- Trang Loại Tài Sản (`/admin/loai-tai-san`) - không thấy button thêm, sửa, xóa
- Tất cả các route được bảo vệ bởi `AdminRoute`
- Các tính năng trong component kiểm tra `isAdmin` dựa trên `user.vaiTro`

**Giải pháp:** Sửa tất cả tham chiếu `user.vaiTro` trong frontend code thành `user.vaitro` để khớp với backend response.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN user có quyền ADMIN đăng nhập và truy cập `/admin/loai-tai-san` THEN hệ thống chuyển hướng về trang chủ thay vì hiển thị trang Loại Tài Sản

1.2 WHEN user có quyền ADMIN truy cập trang Tài Sản THEN button "Thêm tài sản", "Sửa", "Xóa" không hiển thị do `isAdmin` được tính sai

1.3 WHEN `AdminRoute` component kiểm tra quyền với `user.vaiTro !== 'ADMIN'` THEN điều kiện luôn true (vì field không tồn tại) và chuyển hướng admin về trang chủ

1.4 WHEN component tính `isAdmin = user?.vaiTro === 'ADMIN'` THEN kết quả luôn false khiến tính năng admin không render

### Expected Behavior (Correct)

2.1 WHEN user có quyền ADMIN đăng nhập và truy cập `/admin/loai-tai-san` THEN hệ thống SHALL hiển thị trang Loại Tài Sản với đầy đủ button "Thêm loại tài sản", "Sửa", "Xóa"

2.2 WHEN user có quyền ADMIN truy cập trang Tài Sản THEN hệ thống SHALL hiển thị button "Thêm tài sản", "Sửa", "Xóa"

2.3 WHEN `AdminRoute` component kiểm tra quyền với `user.vaitro !== 'ADMIN'` THEN hệ thống SHALL đánh giá đúng quyền admin và cho phép truy cập

2.4 WHEN component tính `isAdmin = user?.vaitro === 'ADMIN'` THEN hệ thống SHALL trả về true cho user admin và render đầy đủ tính năng admin

### Unchanged Behavior (Regression Prevention)

3.1 WHEN user có quyền USER (không phải ADMIN) truy cập `/admin/loai-tai-san` THEN hệ thống SHALL CONTINUE TO chuyển hướng về trang chủ

3.2 WHEN user có quyền USER xem trang Tài Sản THEN hệ thống SHALL CONTINUE TO ẩn button "Thêm", "Sửa", "Xóa"

3.3 WHEN user không đăng nhập truy cập route bảo vệ THEN hệ thống SHALL CONTINUE TO chuyển hướng đến trang đăng nhập

3.4 WHEN các tính năng khác trong hệ thống sử dụng `user.tendangnhap`, `user.hoten`, `user.email` THEN hệ thống SHALL CONTINUE TO hoạt động bình thường

3.5 WHEN `MainLayout.jsx` render menu dựa trên `user?.vaitro === 'ADMIN'` THEN hệ thống SHALL CONTINUE TO hoạt động đúng (đây là code đúng, không sửa)

---

## Bug Condition & Property

### Bug Condition Function

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type {component: string, fieldName: string}
  OUTPUT: boolean
  
  // Trả về true khi component sử dụng sai tên field vaitro
  RETURN (X.component IN ["AdminRoute.jsx", "TaiSanList.jsx"]) 
         AND (X.fieldName = "vaiTro")
END FUNCTION
```

**Concrete Examples:**
- `{component: "AdminRoute.jsx", fieldName: "vaiTro"}` → Bug condition MET
- `{component: "TaiSanList.jsx", fieldName: "vaiTro"}` → Bug condition MET  
- `{component: "MainLayout.jsx", fieldName: "vaitro"}` → Bug condition NOT MET (đã đúng)

### Property Specification

```pascal
// Property: Fix Checking - Field Name Consistency
FOR ALL X WHERE isBugCondition(X) DO
  result ← checkFieldName'(X)
  ASSERT result.fieldName = "vaitro" AND result.matchesBackend = true
END FOR
```

**Expected after fix:**
- `AdminRoute.jsx` uses `user.vaitro !== 'ADMIN'`
- `TaiSanList.jsx` uses `user?.vaitro === 'ADMIN'`
- Admin user có thể truy cập `/admin/loai-tai-san` và thấy button "Thêm loại tài sản"

### Preservation Goal

```pascal
// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
END FOR
```

**Components không thay đổi:**
- `MainLayout.jsx` đã dùng `user?.vaitro === 'ADMIN'` (đúng) → không sửa
- `AuthContext.jsx` → không sửa
- Backend Response DTOs → không sửa
- Các field khác như `tendangnhap`, `hoten`, `email` → không ảnh hưởng

---

## Files Affected

### Files to Modify:
1. **frontend/src/routes/AdminRoute.jsx**
   - Dòng 20: `if (user.vaiTro !== 'ADMIN')` → `if (user.vaitro !== 'ADMIN')`

2. **frontend/src/pages/taisan/TaiSanList.jsx**
   - Dòng 18: `const isAdmin = user?.vaiTro === 'ADMIN'` → `const isAdmin = user?.vaitro === 'ADMIN'`

### Files Already Correct (No Change):
- `frontend/src/layouts/MainLayout.jsx` - đã dùng `user?.vaitro === 'ADMIN'` ✓
- Backend DTOs (`UserInfoResponse.java`, `LoginResponse.java`) - giữ nguyên field `vaitro`
