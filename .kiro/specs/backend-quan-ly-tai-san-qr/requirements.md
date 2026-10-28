# Tài Liệu Yêu Cầu - Backend Hệ Thống Quản Lý Tài Sản Bằng Mã QR

## Giới Thiệu

Hệ thống backend RESTful API cho phép quản lý tài sản bằng mã QR, được xây dựng trên Spring Boot 3.x với Java 17. Hệ thống kết nối với MySQL database có 13 bảng đã được định nghĩa trước, sử dụng Spring Security + JWT cho xác thực với 2 vai trò (ADMIN và USER), ZXing cho sinh mã QR, và Spring Data JPA cho truy cập dữ liệu.

## Thuật Ngữ

- **Backend_System**: Hệ thống backend RESTful API được xây dựng bằng Spring Boot
- **Asset**: Tài sản cần quản lý, được lưu trong bảng `taisan`
- **QR_Code**: Mã QR được sinh động từ URL chứa `taisan_id`, không lưu trong database
- **Asset_Transfer**: Quá trình luân chuyển tài sản (bàn giao, thu hồi, điều chuyển)
- **Maintenance_Record**: Bản ghi bảo trì/sửa chữa tài sản
- **Inventory_Session**: Đợt kiểm kê tài sản
- **User**: Người dùng với vai trò ADMIN hoặc USER
- **JWT_Token**: Token xác thực JSON Web Token
- **Soft_Delete**: Xóa mềm bằng cách đánh dấu cột `daxoa = 1`
- **Entity**: Lớp Java ánh xạ với bảng database
- **DTO**: Data Transfer Object, đối tượng truyền dữ liệu giữa client và server
- **Repository**: Lớp truy cập dữ liệu kế thừa JpaRepository
- **Service**: Lớp xử lý logic nghiệp vụ
- **Controller**: Lớp xử lý HTTP requests và định nghĩa REST endpoints
- **Asset_State**: Trạng thái tài sản (IN_USE, AVAILABLE, MAINTENANCE, BROKEN)
- **Department**: Đơn vị, được lưu trong bảng `donvi`
- **Location**: Vị trí tài sản, được lưu trong bảng `vitri`
- **Asset_Type**: Loại tài sản, được lưu trong bảng `loaitaisan`

## Yêu Cầu

### Yêu Cầu 1: Cấu Hình Kết Nối Database

**User Story:** Là một developer, tôi muốn kết nối với MySQL database đã có sẵn, để có thể truy xuất và cập nhật dữ liệu tài sản.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL kết nối với MySQL database tên `quanlytaisanqr` trên localhost:3306
2. THE Backend_System SHALL sử dụng `spring.jpa.hibernate.ddl-auto=none` để ngăn Hibernate tự động tạo hoặc sửa đổi bảng
3. THE Backend_System SHALL đặt múi giờ `serverTimezone=Asia/Ho_Chi_Minh`
4. WHEN Backend_System khởi động, THE Backend_System SHALL xác minh kết nối database thành công

### Yêu Cầu 2: Ánh Xạ Entity Với Database Schema

**User Story:** Là một developer, tôi muốn các entity Java ánh xạ chính xác với các bảng database có tên tiếng Việt không dấu, để đảm bảo tính nhất quán dữ liệu.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL tạo 13 entity classes tương ứng với 13 bảng database
2. FOR ALL entity classes, THE Backend_System SHALL khai báo `@Table(name="<tên_bảng>")` tường minh
3. FOR ALL entity fields, THE Backend_System SHALL khai báo `@Column(name="<tên_cột>")` tường minh với tên tiếng Việt không dấu
4. THE Backend_System SHALL sử dụng `@GeneratedValue(strategy = GenerationType.IDENTITY)` cho các trường khóa chính auto-increment
5. THE Backend_System SHALL định nghĩa các foreign key relationships bằng `@ManyToOne`, `@OneToMany`, và `@JoinColumn` annotations
6. THE Backend_System SHALL ánh xạ ENUM database types (loaiphieu, loaibaotri, trangthaixuly, trangthai, ketqua) với Java enum classes

### Yêu Cầu 3: Xác Thực Người Dùng Bằng JWT

**User Story:** Là một người dùng, tôi muốn đăng nhập bằng tên đăng nhập và mật khẩu, để nhận được JWT token và truy cập hệ thống.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi POST request đến `/api/auth/login` với `tendangnhap` và `matkhau` hợp lệ, THEN THE Backend_System SHALL trả về JWT token và thông tin người dùng
2. WHEN User gửi POST request đến `/api/auth/login` với thông tin không hợp lệ, THEN THE Backend_System SHALL trả về HTTP 401 Unauthorized
3. THE Backend_System SHALL mã hóa mật khẩu bằng BCrypt trước khi so sánh với `matkhaumahoa` trong database
4. THE Backend_System SHALL sinh JWT token chứa `nguoidung_id`, `tendangnhap`, và `vaitro_id`
5. THE Backend_System SHALL đặt thời gian hết hạn cho JWT token
6. WHEN User gửi request với JWT token hợp lệ trong Authorization header, THEN THE Backend_System SHALL xác thực và cho phép truy cập
7. WHEN User gửi request với JWT token không hợp lệ hoặc hết hạn, THEN THE Backend_System SHALL trả về HTTP 401 Unauthorized

### Yêu Cầu 4: Phân Quyền ADMIN và USER

**User Story:** Là một admin, tôi muốn có quyền thêm, sửa, xóa mọi thứ, còn user chỉ được xem, quét QR và báo hỏng, để đảm bảo bảo mật hệ thống.

#### Tiêu Chí Chấp Nhận

1. WHEN User có `vaitro.mavaitro = 'ADMIN'` gọi bất kỳ API endpoint nào, THEN THE Backend_System SHALL cho phép truy cập
2. WHEN User có `vaitro.mavaitro = 'USER'` gọi GET endpoints (xem dữ liệu), THEN THE Backend_System SHALL cho phép truy cập
3. WHEN User có `vaitro.mavaitro = 'USER'` gọi POST `/api/lichsuquet` (quét QR), THEN THE Backend_System SHALL cho phép truy cập
4. WHEN User có `vaitro.mavaitro = 'USER'` gọi POST `/api/baotri` (báo hỏng), THEN THE Backend_System SHALL cho phép truy cập
5. WHEN User có `vaitro.mavaitro = 'USER'` gọi các endpoints POST/PUT/DELETE khác (thêm/sửa/xóa), THEN THE Backend_System SHALL trả về HTTP 403 Forbidden
6. THE Backend_System SHALL sử dụng `@PreAuthorize` annotation để kiểm tra quyền trên từng endpoint

### Yêu Cầu 5: Quản Lý Tài Sản (CRUD)

**User Story:** Là một admin, tôi muốn tạo, đọc, cập nhật và xóa tài sản, để quản lý danh sách tài sản trong hệ thống.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/taisan` với dữ liệu hợp lệ, THEN THE Backend_System SHALL tạo Asset mới và trả về HTTP 201 Created với AssetResponse DTO
2. WHEN User gửi GET request đến `/api/taisan/{id}`, THEN THE Backend_System SHALL trả về thông tin Asset với `taisan_id` tương ứng và `daxoa = 0`
3. WHEN User gửi GET request đến `/api/taisan`, THEN THE Backend_System SHALL trả về danh sách tất cả Assets với `daxoa = 0`
4. WHEN ADMIN gửi PUT request đến `/api/taisan/{id}` với dữ liệu hợp lệ, THEN THE Backend_System SHALL cập nhật Asset và trả về AssetResponse DTO
5. WHEN ADMIN gửi DELETE request đến `/api/taisan/{id}`, THEN THE Backend_System SHALL đặt `daxoa = 1` (Soft_Delete) và trả về HTTP 204 No Content
6. WHEN User gửi GET request đến `/api/taisan/{id}` với `taisan_id` không tồn tại hoặc `daxoa = 1`, THEN THE Backend_System SHALL trả về HTTP 404 Not Found
7. THE Backend_System SHALL validate dữ liệu đầu vào (mataisan unique, loaitaisan_id exists, ngaynhap not null, v.v.)
8. THE Backend_System SHALL trả về DTO thay vì Entity trực tiếp

### Yêu Cầu 6: Tìm Kiếm và Lọc Tài Sản

**User Story:** Là một người dùng, tôi muốn tìm kiếm và lọc tài sản theo nhiều tiêu chí, để nhanh chóng tìm thấy tài sản cần thiết.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi GET request đến `/api/taisan/search` với tham số `keyword`, THEN THE Backend_System SHALL trả về danh sách Assets có `mataisan` HOẶC `tentaisan` chứa keyword (case-insensitive) và `daxoa = 0`
2. WHEN User gửi GET request đến `/api/taisan/filter` với tham số `loaitaisan_id`, THEN THE Backend_System SHALL trả về danh sách Assets có `loaitaisan_id` tương ứng và `daxoa = 0`
3. WHEN User gửi GET request đến `/api/taisan/filter` với tham số `trangthaitaisan_id`, THEN THE Backend_System SHALL trả về danh sách Assets có `trangthaitaisan_id` tương ứng và `daxoa = 0`
4. WHEN User gửi GET request đến `/api/taisan/filter` với tham số `vitri_id`, THEN THE Backend_System SHALL trả về danh sách Assets có `vitri_id` tương ứng và `daxoa = 0`
5. WHEN User gửi GET request đến `/api/taisan/filter` với tham số `donvi_id`, THEN THE Backend_System SHALL trả về danh sách Assets có `vitri.donvi_id` tương ứng và `daxoa = 0`
6. WHEN User gửi GET request với nhiều tham số lọc, THEN THE Backend_System SHALL kết hợp các điều kiện bằng AND logic
7. WHEN User gửi GET request với tham số `page` và `size`, THEN THE Backend_System SHALL trả về kết quả phân trang

### Yêu Cầu 7: Sinh Mã QR Cho Tài Sản

**User Story:** Là một admin, tôi muốn sinh mã QR cho mỗi tài sản, để có thể in và dán lên tài sản vật lý.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi GET request đến `/api/taisan/{id}/qrcode`, THEN THE Backend_System SHALL sinh QR_Code dạng PNG với nội dung là URL `https://domain.com/assets/{taisan_id}`
2. THE Backend_System SHALL sử dụng thư viện ZXing để sinh QR_Code theo chuẩn ISO/IEC 18004
3. THE Backend_System SHALL trả về response với `Content-Type: image/png`
4. THE Backend_System SHALL đặt kích thước QR_Code là 300x300 pixels
5. THE Backend_System SHALL đặt error correction level là MEDIUM (M)
6. WHEN User gửi GET request đến `/api/taisan/{id}/qrcode` với `taisan_id` không tồn tại, THEN THE Backend_System SHALL trả về HTTP 404 Not Found
7. THE Backend_System SHALL KHÔNG lưu ảnh QR_Code vào database

### Yêu Cầu 8: Tra Cứu Tài Sản Theo ID (Sau Khi Quét QR)

**User Story:** Là một người dùng, tôi muốn quét mã QR và xem thông tin chi tiết tài sản, để biết trạng thái và lịch sử tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi GET request đến `/api/taisan/{id}`, THEN THE Backend_System SHALL trả về AssetDetailResponse chứa thông tin từ view `chitiettaisan`
2. THE AssetDetailResponse SHALL bao gồm `mataisan`, `tentaisan`, `tenloai`, `thongsokythuat`, `ngaynhap`, `giatri`, `tenvitri`, `tendonvi`, `matrangthai`, `tentrangthai`, `nguoisudung`
3. WHEN User quét QR_Code và truy cập URL, THEN THE Backend_System SHALL ghi lại thông tin vào bảng `lichsuquet` với `taisan_id`, `nguoidung_id`, và `thoigianquet`
4. THE Backend_System SHALL cho phép `nguoidung_id = NULL` nếu quét không đăng nhập

### Yêu Cầu 9: Bàn Giao Tài Sản

**User Story:** Là một admin, tôi muốn bàn giao tài sản từ người này sang người khác, để theo dõi trách nhiệm quản lý tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/luanchuyen` với `loaiphieu='BANGIAO'`, `taisan_id`, `nguoigiao_id`, `nguoinhan_id`, `ngaythuchien`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `luanchuyen`
2. WHEN bàn giao thành công, THEN THE Backend_System SHALL cập nhật `taisan.nguoisudung_id` thành `nguoinhan_id` trong cùng transaction
3. WHEN bàn giao thành công và Asset có `trangthaitaisan_id` là AVAILABLE, THEN THE Backend_System SHALL đổi `trangthaitaisan_id` thành IN_USE
4. WHEN bàn giao thành công, THEN THE Backend_System SHALL ghi lại thay đổi trạng thái vào bảng `lichsutrangthai` nếu trạng thái thay đổi
5. WHEN ADMIN gửi POST request với `taisan_id` không tồn tại hoặc `nguoigiao_id`/`nguoinhan_id` không hợp lệ, THEN THE Backend_System SHALL trả về HTTP 400 Bad Request
6. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 10: Thu Hồi Tài Sản

**User Story:** Là một admin, tôi muốn thu hồi tài sản về kho, để tài sản có thể được bàn giao cho người khác.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/luanchuyen` với `loaiphieu='THUHOI'`, `taisan_id`, `nguoigiao_id`, `ngaythuchien`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `luanchuyen` với `nguoinhan_id = NULL`
2. WHEN thu hồi thành công, THEN THE Backend_System SHALL đặt `taisan.nguoisudung_id = NULL` trong cùng transaction
3. WHEN thu hồi thành công, THEN THE Backend_System SHALL đổi `trangthaitaisan_id` thành AVAILABLE trong cùng transaction
4. WHEN thu hồi thành công, THEN THE Backend_System SHALL ghi lại thay đổi trạng thái vào bảng `lichsutrangthai`
5. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 11: Điều Chuyển Tài Sản (Đổi Vị Trí)

**User Story:** Là một admin, tôi muốn điều chuyển tài sản sang vị trí khác, để cập nhật vị trí thực tế của tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/luanchuyen` với `loaiphieu='DIEUCHUYEN'`, `taisan_id`, `vitri_id`, `ngaythuchien`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `luanchuyen`
2. WHEN điều chuyển thành công, THEN THE Backend_System SHALL cập nhật `taisan.vitri_id` thành `vitri_id` mới trong cùng transaction
3. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 12: Báo Hỏng Tài Sản

**User Story:** Là một người dùng, tôi muốn báo hỏng tài sản, để tài sản được sửa chữa kịp thời.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi POST request đến `/api/baotri` với `loaibaotri='SUACHUA'`, `taisan_id`, `motahuhong`, `ngaybao`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `baotri` với `trangthaixuly='CHOXULY'`
2. WHEN báo hỏng thành công, THEN THE Backend_System SHALL đổi `taisan.trangthaitaisan_id` thành BROKEN trong cùng transaction
3. WHEN báo hỏng thành công, THEN THE Backend_System SHALL ghi lại thay đổi trạng thái vào bảng `lichsutrangthai`
4. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 13: Cập Nhật Tiến Trình Sửa Chữa

**User Story:** Là một admin, tôi muốn cập nhật tiến trình sửa chữa tài sản, để theo dõi trạng thái bảo trì.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi PUT request đến `/api/baotri/{id}` với `trangthaixuly`, THEN THE Backend_System SHALL cập nhật `baotri.trangthaixuly`
2. WHEN ADMIN cập nhật `trangthaixuly='HOANTHANH'`, THEN THE Backend_System SHALL yêu cầu `ngayhoanthanh` và `ketqua`
3. WHEN ADMIN cập nhật `trangthaixuly='HOANTHANH'` và `loaibaotri='SUACHUA'`, THEN THE Backend_System SHALL đổi `taisan.trangthaitaisan_id` thành AVAILABLE trong cùng transaction
4. WHEN ADMIN cập nhật `trangthaixuly='HOANTHANH'` và `loaibaotri='DINHKY'`, THEN THE Backend_System SHALL KHÔNG đổi trạng thái tài sản
5. WHEN ADMIN cập nhật `trangthaixuly='DANGXULY'`, THEN THE Backend_System SHALL đổi `taisan.trangthaitaisan_id` thành MAINTENANCE trong cùng transaction
6. WHEN trạng thái tài sản thay đổi, THEN THE Backend_System SHALL ghi lại vào bảng `lichsutrangthai`
7. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 14: Bảo Trì Định Kỳ

**User Story:** Là một admin, tôi muốn lên lịch bảo trì định kỳ cho tài sản, để tài sản luôn hoạt động tốt.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/baotri` với `loaibaotri='DINHKY'`, `taisan_id`, `ngaybao`, `ngaybaotritieptheo`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `baotri`
2. WHEN ADMIN gửi GET request đến `/api/baotri/sap-den-han`, THEN THE Backend_System SHALL trả về danh sách Maintenance_Records có `ngaybaotritieptheo` trong vòng 30 ngày tới và `trangthaixuly='HOANTHANH'`

### Yêu Cầu 15: Tạo Đợt Kiểm Kê

**User Story:** Là một admin, tôi muốn tạo đợt kiểm kê tài sản, để kiểm tra sự tồn tại và vị trí của tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/dotkiemke` với `tendot`, `donvi_id`, `ngaybatdau`, THEN THE Backend_System SHALL tạo bản ghi mới trong bảng `dotkiemke` với `trangthai='DANGMO'`
2. WHEN đợt kiểm kê được tạo, THEN THE Backend_System SHALL tự động tạo các bản ghi trong bảng `chitietkiemke` cho tất cả Assets thuộc `donvi_id` với `ketqua='CHUAKIEM'`
3. WHEN `donvi_id = NULL`, THEN THE Backend_System SHALL tạo `chitietkiemke` cho tất cả Assets trong hệ thống
4. THE Backend_System SHALL đánh dấu method với `@Transactional` để đảm bảo atomicity

### Yêu Cầu 16: Ghi Nhận Kết Quả Kiểm Kê

**User Story:** Là một người dùng, tôi muốn quét QR và ghi nhận kết quả kiểm kê, để cập nhật trạng thái tài sản trong đợt kiểm kê.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi POST request đến `/api/dotkiemke/{id}/kiemke` với `taisan_id`, `vitrithucte_id`, THEN THE Backend_System SHALL tìm bản ghi `chitietkiemke` tương ứng với `dotkiemke_id` và `taisan_id`
2. WHEN Asset được tìm thấy và `vitrithucte_id` khớp với `taisan.vitri_id`, THEN THE Backend_System SHALL cập nhật `chitietkiemke.ketqua='CO'`
3. WHEN Asset được tìm thấy và `vitrithucte_id` khác `taisan.vitri_id`, THEN THE Backend_System SHALL cập nhật `chitietkiemke.ketqua='LECHVITRI'` và ghi nhận `vitrithucte_id`
4. WHEN cập nhật kết quả, THEN THE Backend_System SHALL ghi lại `chitietkiemke.nguoidung_id` và `thoigiankiem`
5. WHEN User gửi request với `dotkiemke.trangthai='DADONG'`, THEN THE Backend_System SHALL trả về HTTP 400 Bad Request với thông báo "Đợt kiểm kê đã đóng"

### Yêu Cầu 17: Đóng Đợt Kiểm Kê

**User Story:** Là một admin, tôi muốn đóng đợt kiểm kê, để hoàn tất việc kiểm kê và không cho phép cập nhật thêm.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi PUT request đến `/api/dotkiemke/{id}/dong`, THEN THE Backend_System SHALL cập nhật `dotkiemke.trangthai='DADONG'`
2. WHEN đợt kiểm kê đã đóng, THEN THE Backend_System SHALL KHÔNG cho phép cập nhật `chitietkiemke` cho đợt đó
3. WHEN ADMIN gửi GET request đến `/api/dotkiemke/{id}/baocao`, THEN THE Backend_System SHALL trả về báo cáo tổng hợp với số lượng tài sản theo từng `ketqua` (CO, THIEU, LECHVITRI, CHUAKIEM)

### Yêu Cầu 18: Thống Kê Dashboard

**User Story:** Là một người dùng, tôi muốn xem thống kê tổng quan, để nắm bắt tình hình tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN User gửi GET request đến `/api/thongke/dashboard`, THEN THE Backend_System SHALL trả về tổng số Assets với `daxoa = 0`
2. THE Backend_System SHALL trả về số lượng Assets theo từng Asset_State dựa trên view `thongketheotrangthai`
3. THE Backend_System SHALL trả về tổng giá trị tài sản (SUM của `taisan.giatri` với `daxoa = 0`)
4. THE Backend_System SHALL trả về số lượng Assets đang bảo trì (COUNT `baotri` với `trangthaixuly IN ('CHOXULY','DANGXULY')`)
5. THE Backend_System SHALL trả về số lượng Assets cần bảo trì định kỳ sắp tới (COUNT `baotri` với `ngaybaotritieptheo` trong 30 ngày)

### Yêu Cầu 19: Báo Cáo Luân Chuyển Tài Sản

**User Story:** Là một admin, tôi muốn xem báo cáo luân chuyển tài sản, để theo dõi lịch sử di chuyển tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi GET request đến `/api/baocao/luanchuyen` với tham số `tu_ngay` và `den_ngay`, THEN THE Backend_System SHALL trả về danh sách Asset_Transfers trong khoảng thời gian `ngaythuchien` tương ứng
2. WHEN ADMIN gửi GET request với tham số `loaiphieu`, THEN THE Backend_System SHALL lọc theo loại phiếu (BANGIAO, THUHOI, DIEUCHUYEN)
3. WHEN ADMIN gửi GET request với tham số `donvi_id`, THEN THE Backend_System SHALL lọc theo Department
4. THE Backend_System SHALL hỗ trợ phân trang với tham số `page` và `size`

### Yêu Cầu 20: Báo Cáo Bảo Trì

**User Story:** Là một admin, tôi muốn xem báo cáo bảo trì, để theo dõi chi phí và hiệu quả bảo trì.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi GET request đến `/api/baocao/baotri` với tham số `tu_ngay` và `den_ngay`, THEN THE Backend_System SHALL trả về danh sách Maintenance_Records trong khoảng thời gian `ngaybao` tương ứng
2. WHEN ADMIN gửi GET request với tham số `loaibaotri`, THEN THE Backend_System SHALL lọc theo loại bảo trì (SUACHUA, DINHKY)
3. WHEN ADMIN gửi GET request với tham số `trangthaixuly`, THEN THE Backend_System SHALL lọc theo trạng thái xử lý
4. THE Backend_System SHALL trả về tổng chi phí bảo trì (SUM của `baotri.chiphi`)
5. THE Backend_System SHALL hỗ trợ phân trang với tham số `page` và `size`

### Yêu Cầu 21: Quản Lý Người Dùng (ADMIN Only)

**User Story:** Là một admin, tôi muốn quản lý người dùng, để kiểm soát quyền truy cập hệ thống.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/nguoidung` với `tendangnhap`, `matkhau`, `hoten`, `email`, `vaitro_id`, `donvi_id`, THEN THE Backend_System SHALL tạo User mới với mật khẩu được mã hóa bằng BCrypt
2. WHEN ADMIN gửi GET request đến `/api/nguoidung`, THEN THE Backend_System SHALL trả về danh sách tất cả Users
3. WHEN ADMIN gửi PUT request đến `/api/nguoidung/{id}`, THEN THE Backend_System SHALL cập nhật thông tin User
4. WHEN ADMIN cập nhật mật khẩu, THEN THE Backend_System SHALL mã hóa bằng BCrypt trước khi lưu
5. WHEN ADMIN gửi PUT request đến `/api/nguoidung/{id}/vo-hieu-hoa`, THEN THE Backend_System SHALL đặt `nguoidung.hoatdong = 0`
6. WHEN User có `hoatdong = 0` cố gắng đăng nhập, THEN THE Backend_System SHALL trả về HTTP 401 Unauthorized với thông báo "Tài khoản đã bị vô hiệu hóa"

### Yêu Cầu 22: Quản Lý Đơn Vị

**User Story:** Là một admin, tôi muốn quản lý đơn vị, để tổ chức cơ cấu phòng ban.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/donvi` với `madonvi`, `tendonvi`, `donvicha_id`, THEN THE Backend_System SHALL tạo Department mới
2. WHEN ADMIN gửi GET request đến `/api/donvi`, THEN THE Backend_System SHALL trả về danh sách tất cả Departments
3. WHEN ADMIN gửi PUT request đến `/api/donvi/{id}`, THEN THE Backend_System SHALL cập nhật thông tin Department
4. WHEN ADMIN gửi DELETE request đến `/api/donvi/{id}`, THEN THE Backend_System SHALL xóa Department nếu không còn liên kết với bảng khác
5. WHEN Department có liên kết với `nguoidung`, `vitri`, hoặc `dotkiemke`, THEN THE Backend_System SHALL trả về HTTP 400 Bad Request với thông báo "Không thể xóa đơn vị đang được sử dụng"

### Yêu Cầu 23: Quản Lý Vị Trí

**User Story:** Là một admin, tôi muốn quản lý vị trí, để xác định nơi lưu trữ tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/vitri` với `mavitri`, `tenvitri`, `donvi_id`, THEN THE Backend_System SHALL tạo Location mới
2. WHEN ADMIN gửi GET request đến `/api/vitri`, THEN THE Backend_System SHALL trả về danh sách tất cả Locations
3. WHEN ADMIN gửi GET request đến `/api/vitri?donvi_id={id}`, THEN THE Backend_System SHALL trả về danh sách Locations thuộc Department tương ứng
4. WHEN ADMIN gửi PUT request đến `/api/vitri/{id}`, THEN THE Backend_System SHALL cập nhật thông tin Location
5. WHEN ADMIN gửi DELETE request đến `/api/vitri/{id}`, THEN THE Backend_System SHALL xóa Location nếu không còn liên kết với `taisan` hoặc `chitietkiemke`

### Yêu Cầu 24: Quản Lý Loại Tài Sản

**User Story:** Là một admin, tôi muốn quản lý loại tài sản, để phân loại tài sản.

#### Tiêu Chí Chấp Nhận

1. WHEN ADMIN gửi POST request đến `/api/loaitaisan` với `tenloai`, THEN THE Backend_System SHALL tạo Asset_Type mới
2. WHEN ADMIN gửi GET request đến `/api/loaitaisan`, THEN THE Backend_System SHALL trả về danh sách tất cả Asset_Types
3. WHEN ADMIN gửi PUT request đến `/api/loaitaisan/{id}`, THEN THE Backend_System SHALL cập nhật Asset_Type
4. WHEN ADMIN gửi DELETE request đến `/api/loaitaisan/{id}`, THEN THE Backend_System SHALL xóa Asset_Type nếu không còn liên kết với `taisan`

### Yêu Cầu 25: Tài Liệu API Với Swagger UI

**User Story:** Là một developer, tôi muốn xem tài liệu API tương tác, để dễ dàng test và tích hợp.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL cung cấp Swagger UI tại endpoint `/swagger-ui.html`
2. THE Backend_System SHALL hiển thị tất cả REST endpoints với mô tả, parameters, request body, và response
3. THE Backend_System SHALL cho phép thử nghiệm API trực tiếp từ Swagger UI
4. THE Backend_System SHALL nhóm endpoints theo controllers (Auth, TaiSan, LuanChuyen, BaoTri, KiemKe, ThongKe, NguoiDung, DanhMuc)

### Yêu Cầu 26: Xử Lý Lỗi Toàn Cục

**User Story:** Là một developer, tôi muốn các lỗi được xử lý nhất quán, để client dễ dàng hiểu và xử lý lỗi.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL sử dụng `@RestControllerAdvice` để xử lý lỗi toàn cục
2. WHEN xảy ra exception không tìm thấy entity (EntityNotFoundException), THEN THE Backend_System SHALL trả về HTTP 404 Not Found với message rõ ràng
3. WHEN xảy ra validation error, THEN THE Backend_System SHALL trả về HTTP 400 Bad Request với danh sách các lỗi validation
4. WHEN xảy ra duplicate key violation (mataisan, madonvi, tendangnhap trùng), THEN THE Backend_System SHALL trả về HTTP 409 Conflict
5. WHEN xảy ra internal server error, THEN THE Backend_System SHALL trả về HTTP 500 Internal Server Error và ghi log chi tiết
6. THE Backend_System SHALL trả về error response với format chuẩn: `{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "...", "path": "..." }`

### Yêu Cầu 27: Validation Dữ Liệu Đầu Vào

**User Story:** Là một developer, tôi muốn dữ liệu đầu vào được validate, để đảm bảo tính toàn vẹn dữ liệu.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL sử dụng Bean Validation annotations (`@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Positive`, `@PastOrPresent`) trong các DTO classes
2. WHEN User gửi request với dữ liệu không hợp lệ, THEN THE Backend_System SHALL trả về HTTP 400 Bad Request với danh sách lỗi validation chi tiết
3. THE Backend_System SHALL validate `mataisan` unique trước khi tạo hoặc cập nhật Asset
4. THE Backend_System SHALL validate foreign keys tồn tại (loaitaisan_id, vitri_id, nguoidung_id, v.v.) trước khi tạo hoặc cập nhật
5. THE Backend_System SHALL validate `ngaynhap` không được là ngày tương lai
6. THE Backend_System SHALL validate `giatri` phải là số dương

### Yêu Cầu 28: CORS Configuration

**User Story:** Là một frontend developer, tôi muốn gọi API từ domain khác, để tích hợp với ứng dụng web.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL cấu hình CORS cho phép requests từ `http://localhost:3000` (React development server)
2. THE Backend_System SHALL cho phép các HTTP methods: GET, POST, PUT, DELETE, OPTIONS
3. THE Backend_System SHALL cho phép headers: Authorization, Content-Type
4. THE Backend_System SHALL đặt `allowCredentials = true`
5. WHERE production environment, THE Backend_System SHALL chỉ cho phép requests từ domain chính thức

### Yêu Cầu 29: Logging

**User Story:** Là một developer, tôi muốn hệ thống ghi log các hoạt động quan trọng, để dễ dàng debug và audit.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL sử dụng SLF4J với Logback để ghi log
2. THE Backend_System SHALL ghi log INFO khi User đăng nhập thành công với thông tin `tendangnhap` và thời gian
3. THE Backend_System SHALL ghi log WARN khi User đăng nhập thất bại với thông tin `tendangnhap` và lý do
4. THE Backend_System SHALL ghi log INFO khi tạo/cập nhật/xóa Asset, Asset_Transfer, Maintenance_Record
5. THE Backend_System SHALL ghi log ERROR khi xảy ra exception với stack trace đầy đủ
6. THE Backend_System SHALL KHÔNG ghi log sensitive data (mật khẩu, JWT token)

### Yêu Cầu 30: Transaction Management

**User Story:** Là một developer, tôi muốn các thao tác cập nhật nhiều bảng được thực hiện trong transaction, để đảm bảo tính nhất quán dữ liệu.

#### Tiêu Chí Chấp Nhận

1. THE Backend_System SHALL đánh dấu `@Transactional` cho các service methods cập nhật nhiều bảng
2. WHEN bàn giao tài sản, IF cập nhật `taisan` thất bại, THEN THE Backend_System SHALL rollback cả `luanchuyen` và `lichsutrangthai`
3. WHEN báo hỏng tài sản, IF cập nhật trạng thái thất bại, THEN THE Backend_System SHALL rollback cả `baotri` và `lichsutrangthai`
4. WHEN tạo đợt kiểm kê, IF tạo `chitietkiemke` thất bại, THEN THE Backend_System SHALL rollback `dotkiemke`
5. THE Backend_System SHALL sử dụng isolation level READ_COMMITTED mặc định

