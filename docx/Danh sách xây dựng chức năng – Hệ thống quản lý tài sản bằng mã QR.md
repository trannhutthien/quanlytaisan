# Danh sách xây dựng chức năng – Hệ thống quản lý tài sản bằng mã QR

Quy tắc làm việc: **xong backend (API) của một chức năng → test API → làm giao diện cho chức năng đó → test cả luồng → chuyển sang chức năng tiếp theo.**

Mỗi chức năng dưới đây có phần **Mô tả** giải thích bằng lời chức năng đó dùng để làm gì, hoạt động ra sao và cần lưu ý điều gì, sau đó mới đến danh sách việc cần làm ở backend và giao diện. Lý do chia theo từng chức năng thay vì làm hết backend rồi mới làm giao diện: bạn nhìn thấy kết quả sớm, phát hiện sai sót về dữ liệu ngay khi còn nhỏ, và lúc nào cũng có một bản chạy được để demo cho giảng viên.

## 0. Tiến độ hiện tại

- [x] Cấu trúc backend (Spring Boot) và thư viện
- [x] Cấu trúc frontend (ReactJS) và thư viện
- [x] Tạo database MySQL và kết nối với backend

## 1. Tổng quan thứ tự thực hiện

| Bước | Chức năng | Phụ thuộc | Gợi ý thời gian (theo kế hoạch tuần 3) |
| --- | --- | --- | --- |
| 1 | Nền tảng chung (base, enum, xử lý lỗi, layout) | Đã có backend + frontend + DB | Ngày 1 |
| 2 | Xác thực và phân quyền (Admin / User) | Bước 1 | Ngày 1–2 |
| 3 | Danh mục nền: Khoa, Bộ môn, Phòng, Loại tài sản | Bước 2 | Ngày 2 |
| 4 | Quản lý người dùng | Bước 2, 3 | Ngày 3 |
| 5 | Quản lý tài sản (CRUD, tìm kiếm, lọc) | Bước 3 | Ngày 3–4 |
| 6 | Sinh mã QR (ZXing) | Bước 5 | Ngày 4 |
| 7 | Quét QR và tra cứu | Bước 5, 6 | Ngày 5 |
| 8 | Bàn giao và thu hồi | Bước 4, 5 | Ngày 6 |
| 9 | Sửa chữa và bảo trì | Bước 5 | Ngày 6–7 |
| 10 | Thống kê, kiểm kê, báo cáo | Bước 5, 8, 9 | Ngày 7 |
| 11 | Hoàn thiện, kiểm thử, triển khai | Tất cả | Tuần 4 |

> Thứ tự có thể điều chỉnh, nhưng bước 3 (danh mục) phải xong trước bước 5 (tài sản) vì tài sản cần khóa ngoại tới vị trí và loại tài sản.

## 2. Chi tiết từng chức năng

### Bước 1. Nền tảng chung

**Mô tả:** Bước này chưa tạo ra chức năng nào mà người dùng nhìn thấy, nhưng dựng những phần mà mọi chức năng sau đều dùng chung. Ở backend, bạn định nghĩa các enum (trạng thái tài sản, vai trò), một lớp cha chứa thời gian tạo và cập nhật cho mọi bảng, một khuôn dạng phản hồi API thống nhất và một nơi xử lý lỗi tập trung, để frontend luôn nhận thông báo lỗi cùng một dạng. Ở frontend, bạn cấu hình sẵn axios, router, bố cục chung và vài component dùng lại như bảng dữ liệu, phân trang, hộp xác nhận. Làm kỹ bước này sẽ tránh phải viết lặp và sửa dây chuyền ở các bước sau.

**Backend**

- [ ] Enum `AssetStatus`: `IN_USE`, `AVAILABLE`, `MAINTENANCE`, `BROKEN`
- [ ] Enum `Role`: `ADMIN`, `USER`
- [ ] Lớp `BaseEntity` (`createdAt`, `updatedAt`)
- [ ] Định dạng response chung (`ApiResponse`: success, message, data)
- [ ] `GlobalExceptionHandler` (không tìm thấy, dữ liệu sai, không có quyền)
- [ ] Cấu hình CORS cho frontend

**Frontend**

- [ ] Cấu hình `axios` (baseURL, interceptor gắn token, xử lý lỗi 401/403)
- [ ] Cấu hình router (React Router) và cấu trúc thư mục `pages/`, `components/`, `services/`
- [ ] Layout chính: sidebar, header, vùng nội dung
- [ ] Component dùng chung: bảng dữ liệu, phân trang, modal xác nhận, thông báo (toast)

**Tiêu chí hoàn thành:** chạy được backend và frontend cùng lúc, frontend gọi thử một API và nhận dữ liệu.

---

### Bước 2. Xác thực và phân quyền

**Mô tả:** Mọi API còn lại đều cần biết "ai đang gọi và được phép làm gì", nên đăng nhập được làm sớm. Người dùng gửi tên đăng nhập và mật khẩu; backend so khớp với mật khẩu đã băm bằng BCrypt, nếu đúng thì trả về một JWT. Frontend lưu token và gửi kèm trong mọi yêu cầu sau đó, còn filter của Spring Security đọc token, xác định vai trò (Admin hoặc User) rồi cho qua hoặc chặn. Admin có toàn quyền quản trị; User chủ yếu tra cứu tài sản và báo hỏng. Phía giao diện chỉ ẩn menu và chặn route theo vai trò để thuận tiện cho người dùng, còn việc chặn thật sự phải nằm ở backend, vì ai cũng có thể gọi API trực tiếp.

**Backend**

- [ ] Entity `User` (id, username, password đã mã hóa BCrypt, họ tên, email, role, trạng thái)
- [ ] `UserRepository`, `UserDetailsService`
- [ ] Spring Security + JWT: `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`
- [ ] API:

| Phương thức | Đường dẫn | Mô tả | Quyền |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Đăng nhập, trả về JWT | Công khai |
| GET | `/api/auth/me` | Thông tin người đang đăng nhập | Đã đăng nhập |
| POST | `/api/auth/change-password` | Đổi mật khẩu | Đã đăng nhập |

- [ ] Phân quyền theo đường dẫn / `@PreAuthorize`; tạo sẵn 1 tài khoản Admin mặc định (data seeder)

**Giao diện (làm ngay sau backend)**

- [ ] Trang đăng nhập
- [ ] Lưu token, `AuthContext` (user, role), `PrivateRoute` / `AdminRoute`
- [ ] Ẩn/hiện menu theo vai trò; nút đăng xuất
- [ ] Trang đổi mật khẩu

**Tiêu chí hoàn thành:** đăng nhập đúng vào được trang chính, sai mật khẩu báo lỗi, User không vào được trang chỉ dành cho Admin.

---

### Bước 3. Danh mục nền: Khoa, Bộ môn, Phòng, Loại tài sản

**Mô tả:** Mỗi tài sản cần biết nó thuộc loại nào và đang đặt ở đâu, nên các danh mục này phải có trước khi làm chức năng tài sản. Vị trí được tổ chức theo cấp: Khoa chứa các Bộ môn, Bộ môn chứa các Phòng. Mỗi danh mục là một bộ thêm, sửa, xóa, xem đơn giản; điểm cần chú ý là quan hệ cha con và quy tắc không cho xóa một danh mục đang có tài sản hoặc danh mục con bên trong. Trên giao diện, ô chọn phụ thuộc (chọn Khoa thì chỉ hiện Bộ môn của Khoa đó) nên làm thành một component dùng lại, vì form tài sản và form bàn giao đều cần đến. Đây cũng là bước đầu tiên làm trọn vòng "entity, API, trang giao diện", nên các bước sau sẽ nhanh hơn nhiều.

**Backend**

- [ ] Entity `Department` (Khoa), `Division` (Bộ môn, thuộc Khoa), `Room` (Phòng, thuộc Bộ môn hoặc Khoa), `AssetCategory` (Loại tài sản)
- [ ] Repository, Service, Controller cho từng danh mục
- [ ] API CRUD cho mỗi danh mục (GET danh sách có phân trang, GET theo id, POST, PUT, DELETE); API lấy danh sách phụ thuộc (bộ môn theo khoa, phòng theo bộ môn)
- [ ] Ràng buộc: không cho xóa danh mục đang được tài sản sử dụng
- [ ] Quyền: Admin được thêm/sửa/xóa, User chỉ xem

**Giao diện**

- [ ] Trang quản lý Khoa / Bộ môn / Phòng (bảng + form thêm/sửa trong modal)
- [ ] Trang quản lý Loại tài sản
- [ ] Select phụ thuộc (chọn Khoa → lọc Bộ môn → lọc Phòng) làm thành component dùng lại cho form tài sản

**Tiêu chí hoàn thành:** thêm đủ dữ liệu mẫu (vài khoa, bộ môn, phòng, loại tài sản) qua giao diện.

---

### Bước 4. Quản lý người dùng

**Mô tả:** Admin tạo và quản lý tài khoản cho cán bộ, nhân viên hoặc sinh viên sử dụng hệ thống. Chức năng này cần có trước bàn giao vì khi bàn giao tài sản bạn phải chọn người nhận từ danh sách người dùng. Nên dùng cách khóa tài khoản thay vì xóa hẳn, để lịch sử bàn giao và sửa chữa vẫn còn hiển thị đúng tên người liên quan. Mật khẩu không bao giờ được trả về trong API; khi quên mật khẩu, Admin đặt lại một mật khẩu tạm và người dùng tự đổi sau.

**Backend**

- [ ] API (chỉ Admin): danh sách có tìm kiếm/phân trang, thêm, sửa, khóa/mở khóa, đặt lại mật khẩu, đổi vai trò
- [ ] Kiểm tra trùng username/email

**Giao diện**

- [ ] Trang danh sách người dùng (tìm kiếm, lọc theo vai trò)
- [ ] Form thêm/sửa người dùng; nút khóa/mở khóa, đặt lại mật khẩu
- [ ] Trang thông tin cá nhân

**Tiêu chí hoàn thành:** Admin tạo được tài khoản User và User đăng nhập được.

---

### Bước 5. Quản lý danh mục và thông tin tài sản

**Mô tả:** Đây là chức năng trung tâm của hệ thống. Mỗi tài sản có một mã định danh duy nhất (`asset_id`) làm khóa chính, và chính mã này sẽ được đưa vào mã QR ở bước sau. Ngoài mã, tài sản lưu tên, loại, thông số kỹ thuật, ngày nhập, giá trị, vị trí (Khoa, Bộ môn, Phòng) và trạng thái; tài sản mới tạo mặc định ở trạng thái Còn trống. Vì danh sách sẽ dài dần, tìm kiếm và lọc theo vị trí, loại, trạng thái là phần không nên bỏ qua. Bạn nên chốt cách sinh `asset_id` ngay từ bước này, vì nếu đổi sau khi đã in tem QR thì các tem cũ sẽ không còn dùng được. Với thao tác xóa, nên xóa mềm (đánh dấu ngừng sử dụng) để không làm mất lịch sử liên quan.

**Backend**

- [ ] Entity `Asset`: `asset_id` (PK, mã định danh duy nhất), tên, loại tài sản, thông số kỹ thuật, ngày nhập, giá trị, vị trí (Khoa, Bộ môn, Phòng), trạng thái (`AssetStatus`), người đang sử dụng (có thể rỗng), ảnh (tùy chọn)
- [ ] Cơ chế sinh `asset_id` (ví dụ `TS-2026-0001`) hoặc UUID, bảo đảm không trùng
- [ ] `AssetRepository` với truy vấn tìm kiếm + lọc (theo tên/mã, khoa, bộ môn, phòng, loại, trạng thái), dùng `Specification` hoặc `@Query`
- [ ] API:

| Phương thức | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/api/assets` | Danh sách, tìm kiếm, lọc, phân trang |
| GET | `/api/assets/{assetId}` | Chi tiết tài sản |
| POST | `/api/assets` | Thêm tài sản (Admin) |
| PUT | `/api/assets/{assetId}` | Cập nhật (Admin) |
| DELETE | `/api/assets/{assetId}` | Xóa hoặc ngừng sử dụng (Admin) |

- [ ] Validate dữ liệu (tên bắt buộc, giá trị không âm, ngày nhập hợp lệ)

**Giao diện**

- [ ] Trang danh sách tài sản: bảng, ô tìm kiếm, bộ lọc khoa/bộ môn/phòng/loại/trạng thái, phân trang, nhãn màu theo trạng thái
- [ ] Form thêm/sửa tài sản (dùng select phụ thuộc ở bước 3)
- [ ] Trang chi tiết tài sản (khung để các bước sau gắn thêm: QR, lịch sử bàn giao, lịch sử sửa chữa)

**Tiêu chí hoàn thành:** thêm/sửa/xóa/tìm kiếm/lọc tài sản chạy ổn trên giao diện.

---

### Bước 6. Sinh mã QR

**Mô tả:** Chức năng này biến `asset_id` thành một ảnh QR để in và dán lên thiết bị. Backend dùng thư viện ZXing để vẽ ảnh PNG; nội dung trong mã là đường dẫn tra cứu của tài sản đó. Không cần lưu ảnh vào cơ sở dữ liệu vì có thể tạo lại bất cứ lúc nào từ `asset_id`. Có một điểm cần cân nhắc: nếu QR chứa cả đường dẫn đầy đủ thì khi đổi tên miền, các tem đã in sẽ trỏ sai; vì vậy hãy đặt tên miền trong file cấu hình và chốt tên miền chính thức sớm, hoặc để QR chỉ chứa `asset_id` rồi để trang quét tự ghép đường dẫn. Giao diện cần hiển thị QR ở trang chi tiết, có nút tải ảnh và in tem gồm QR kèm tên và mã tài sản.

**Backend**

- [ ] Service `QrCodeService` dùng ZXing (`QRCodeWriter`, `MatrixToImageWriter`) tạo ảnh PNG
- [ ] Nội dung QR: URL tra cứu `https://domain.com/assets/{asset_id}` (đặt domain trong file cấu hình, không viết cứng)
- [ ] API:

| Phương thức | Đường dẫn | Mô tả |
| --- | --- | --- |
| GET | `/api/assets/{assetId}/qr` | Trả về ảnh QR PNG |
| POST | `/api/assets/qr/batch` | Tạo nhiều mã QR để in hàng loạt (PDF hoặc ZIP, làm sau nếu còn thời gian) |

- [ ] Tự động có QR khi tạo tài sản mới (sinh theo yêu cầu, không nhất thiết lưu file)

**Giao diện**

- [ ] Hiển thị QR trong trang chi tiết tài sản
- [ ] Nút tải ảnh QR và nút in tem QR (kèm tên, mã tài sản bên dưới)
- [ ] Chọn nhiều tài sản trong danh sách để in tem hàng loạt (tùy chọn)

**Tiêu chí hoàn thành:** dùng camera điện thoại quét thử mã đã tạo thì mở đúng đường dẫn tài sản.

---

### Bước 7. Quét QR và tra cứu

**Mô tả:** Đây là chức năng thể hiện rõ nhất giá trị của đề tài. Người dùng dùng camera điện thoại quét tem dán trên tài sản; trình duyệt mở trang thông tin tài sản, hiển thị tên, vị trí, trạng thái, người đang sử dụng và các lịch sử liên quan. Có hai cách quét: dùng ứng dụng camera có sẵn của điện thoại (quét ra đường dẫn và mở trình duyệt), hoặc dùng trang quét ngay trong web của bạn để quét liên tục nhiều tài sản, thuận tiện cho kiểm kê. Cần quyết định rõ ai xem được gì: người chưa đăng nhập chỉ thấy thông tin cơ bản, người đã đăng nhập mới thấy đầy đủ và có nút thao tác như báo hỏng. Lưu ý camera trong trình duyệt chỉ hoạt động trên HTTPS, nên cần kiểm tra trên bản đã triển khai chứ không chỉ trên máy cá nhân.

**Backend**

- [ ] API tra cứu nhanh theo mã: `GET /api/assets/{assetId}` (trả về thông tin cần thiết)
- [ ] Quyết định phạm vi công khai: người chưa đăng nhập chỉ xem thông tin cơ bản; người đã đăng nhập xem đầy đủ lịch sử
- [ ] Trả lỗi rõ ràng khi mã không tồn tại

**Giao diện**

- [ ] Route `/assets/{assetId}` hiển thị thông tin tài sản, tối ưu cho màn hình điện thoại
- [ ] Trang quét QR bằng camera trình duyệt (thư viện gợi ý: `html5-qrcode`), đọc xong tự chuyển đến trang tài sản
- [ ] Xử lý lỗi: không cấp quyền camera, mã QR không thuộc hệ thống
- [ ] Lưu ý: camera trên trình duyệt chỉ hoạt động với HTTPS (hoặc localhost khi phát triển)

**Tiêu chí hoàn thành:** quét QR dán trên tài sản bằng điện thoại thấy ngay thông tin tài sản.

---

### Bước 8. Quản lý bàn giao và thu hồi

**Mô tả:** Chức năng này ghi lại tài sản đang do ai giữ và đã qua tay những ai. Mỗi lần bàn giao hoặc thu hồi tạo ra một phiếu, và phiếu không được sửa về sau để lịch sử luôn đáng tin. Đồng thời với việc tạo phiếu, hệ thống cập nhật trạng thái và người sử dụng hiện tại của tài sản; hai việc này phải nằm trong cùng một giao dịch để không bị lệch dữ liệu nếu một bên lỗi. Quy tắc nghiệp vụ cần chặn rõ ràng: chỉ bàn giao tài sản đang Còn trống, chỉ thu hồi tài sản đang Sử dụng. Trên giao diện, lịch sử luân chuyển hiển thị dạng dòng thời gian trong trang chi tiết tài sản sẽ giúp người xem nắm nhanh.

**Backend**

- [ ] Entity `AssetTransfer` (phiếu): mã phiếu, tài sản, loại (`HANDOVER` bàn giao / `RECALL` thu hồi), người giao, người nhận, đơn vị/phòng, ngày giao/thu hồi, ghi chú
- [ ] Nghiệp vụ trong Service (dùng `@Transactional`):
  - Bàn giao: chỉ cho tài sản `AVAILABLE` → cập nhật người sử dụng, trạng thái thành `IN_USE`
  - Thu hồi: chỉ cho tài sản `IN_USE` → xóa người sử dụng, trạng thái thành `AVAILABLE`
  - Chuyển phòng/đơn vị: cập nhật vị trí và lưu vết
- [ ] API: tạo phiếu bàn giao, tạo phiếu thu hồi, danh sách phiếu (lọc theo thời gian, loại, người), lịch sử luân chuyển của một tài sản

**Giao diện**

- [ ] Form tạo phiếu bàn giao / thu hồi (có thể bấm trực tiếp từ trang chi tiết tài sản)
- [ ] Trang danh sách phiếu
- [ ] Tab "Lịch sử luân chuyển" trong trang chi tiết tài sản (dạng timeline)

**Tiêu chí hoàn thành:** bàn giao rồi thu hồi một tài sản, trạng thái và lịch sử cập nhật đúng.

---

### Bước 9. Theo dõi sửa chữa và bảo trì

**Mô tả:** Chức năng này theo dõi vòng đời "hỏng, sửa, dùng lại" của tài sản. Người dùng quét QR, thấy tài sản có vấn đề thì báo hỏng ngay tại trang; tài sản chuyển sang Hư hỏng. Admin tiếp nhận, chuyển sang Đang bảo trì, ghi lại đơn vị sửa và chi phí, rồi đánh dấu hoàn thành để tài sản trở về trạng thái dùng được. Nên lưu lại trạng thái tài sản trước khi hỏng để khi sửa xong khôi phục đúng (đang được giao cho ai thì quay lại đúng như vậy). Bảo dưỡng định kỳ dùng cùng cấu trúc dữ liệu với sửa chữa, chỉ khác loại phiếu, nên có thể làm gộp để tiết kiệm thời gian.

**Backend**

- [ ] Entity `MaintenanceRecord`: tài sản, loại (`REPAIR` sửa chữa / `PERIODIC` bảo dưỡng định kỳ), mô tả hỏng hóc, người báo, ngày báo, ngày bắt đầu/hoàn thành, chi phí, đơn vị sửa, trạng thái phiếu (mới báo, đang xử lý, hoàn thành)
- [ ] Nghiệp vụ:
  - Báo hỏng → tài sản chuyển `BROKEN`
  - Bắt đầu sửa/bảo trì → `MAINTENANCE`
  - Hoàn thành → trở về `AVAILABLE` hoặc `IN_USE` (theo tình trạng trước đó)
- [ ] API: tạo phiếu báo hỏng (User cũng được báo), cập nhật tiến trình và chi phí (Admin), danh sách phiếu, lịch sử sửa chữa của một tài sản
- [ ] (Tùy chọn) Trường ngày bảo trì kế tiếp để nhắc lịch bảo dưỡng định kỳ

**Giao diện**

- [ ] Nút "Báo hỏng" ngay trang chi tiết tài sản (người dùng quét QR xong báo hỏng luôn)
- [ ] Trang danh sách phiếu sửa chữa/bảo trì và form xử lý cho Admin
- [ ] Tab "Lịch sử sửa chữa" trong trang chi tiết tài sản

**Tiêu chí hoàn thành:** báo hỏng → xử lý → hoàn thành, trạng thái tài sản đổi đúng ở từng bước.

---

### Bước 10. Thống kê, kiểm kê và báo cáo

**Mô tả:** Bước này tổng hợp dữ liệu từ các chức năng trước nên được làm sau cùng. Dashboard đếm số lượng và tính tỷ lệ tài sản theo bốn trạng thái, theo vị trí và theo loại, thường chỉ cần các truy vấn nhóm dữ liệu. Kiểm kê là việc đối chiếu danh sách tài sản trong hệ thống với tài sản thực tế người kiểm kê quét được: tài sản nào không được quét hoặc nằm sai chỗ sẽ hiện ra thành danh sách chênh lệch. Báo cáo cho phép lọc theo thời gian, vị trí rồi xuất ra Excel để nộp hoặc lưu trữ. Nếu thiếu thời gian, hãy làm dashboard cơ bản trước và để kiểm kê theo đợt ở mức đơn giản.

**Backend**

- [ ] API thống kê: số lượng và tỷ lệ tài sản theo trạng thái; theo khoa/bộ môn/phòng; theo loại
- [ ] API danh sách tài sản cần thanh lý (ví dụ hư hỏng lâu ngày, hoặc quá niên hạn) và tài sản cần kiểm kê
- [ ] Kiểm kê định kỳ (mức cơ bản): đợt kiểm kê (`InventorySession`) + kết quả từng tài sản (đã quét thấy / không thấy / sai vị trí)
- [ ] Xuất báo cáo Excel (Apache POI hoặc EasyExcel): danh sách tài sản, lịch sử sửa chữa, danh sách cần thanh lý/kiểm kê

**Giao diện**

- [ ] Dashboard: thẻ số liệu theo 4 trạng thái, biểu đồ tròn/cột (thư viện `recharts` hoặc `chart.js`)
- [ ] Trang kiểm kê: tạo đợt, quét QR để đánh dấu đã kiểm, xem kết quả chênh lệch
- [ ] Trang báo cáo với bộ lọc và nút xuất Excel

**Tiêu chí hoàn thành:** dashboard khớp với dữ liệu thật; xuất được file báo cáo.

---

### Bước 11. Hoàn thiện, kiểm thử và triển khai

**Mô tả:** Giai đoạn cuối không thêm chức năng mới mà kiểm tra toàn bộ hệ thống chạy trọn vẹn như một người dùng thật. Hãy thử cả luồng chính từ đầu đến cuối, thử với tài khoản Admin lẫn User để chắc phân quyền đúng, và thử trên điện thoại thật vì giao diện và camera hay lỗi ở đây nhất. Đồng thời chuẩn bị dữ liệu mẫu đủ đẹp để demo và dành thời gian viết báo cáo cùng slide, vì phần này thường tốn nhiều hơn dự kiến.

- [ ] Kiểm thử từng luồng chính: đăng nhập → thêm tài sản → in QR → quét → bàn giao → báo hỏng → sửa xong → thống kê
- [ ] Kiểm thử phân quyền Admin và User ở cả backend lẫn giao diện
- [ ] Kiểm thử trên điện thoại thật (quét QR, giao diện responsive)
- [ ] Sửa lỗi, kiểm tra thông báo lỗi và validate form
- [ ] Chuẩn bị dữ liệu mẫu để demo
- [ ] Viết báo cáo đồ án và làm slide thuyết trình

## 3. Mẫu quy trình cho mỗi chức năng

1. Thiết kế bảng trong DB (hoặc để Hibernate tự tạo trong giai đoạn phát triển)
2. Viết Entity → Repository → Service → Controller
3. Test API bằng Postman (đủ các trường hợp đúng và sai)
4. Viết service gọi API ở frontend
5. Làm trang giao diện: danh sách → form thêm/sửa → chi tiết
6. Test cả luồng từ giao diện, rồi mới sang chức năng kế tiếp

## 4. Ưu tiên khi thiếu thời gian

- **Bắt buộc (cốt lõi):** bước 1 đến 7 (đăng nhập, danh mục, tài sản, QR sinh và quét)
- **Nên có:** bước 8, 9 (bàn giao/thu hồi, sửa chữa) và dashboard thống kê cơ bản ở bước 10
- **Làm thêm nếu còn thời gian:** in QR hàng loạt, kiểm kê theo đợt, nhắc lịch bảo trì, xuất Excel
