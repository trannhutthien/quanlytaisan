# TÀI LIỆU THAM KHẢO VÀ NGHIỆP VỤ HỆ THỐNG QUẢN LÝ TÀI SẢN BẰNG MÃ QR

## I. THÔNG TIN CHUNG DỰ ÁN

* **Tên đề tài:** Xây dựng hệ thống quản lý tài sản bằng mã QR

* **Loại đề tài:** Thực tập đồ án cơ sở ngành / Khóa luận tốt nghiệp

* **Giảng viên hướng dẫn:** ThS. Nguyễn Hoàng Duy Thiện

* **Sinh viên thực hiện:** Nguyễn Thành Dự

* **Mã số sinh viên:** 110123078

* **Lớp:** DA23TTB

* **Đơn vị:** Khoa Công nghệ Thông tin – Trường Kỹ thuật và Công nghệ (Đại học Trà Vinh)

## II. MỤC TIÊU VÀ CÔNG DỤNG CỦA HỆ THỐNG

### 1. Mục tiêu đề tài

Xây dựng một hệ thống quản lý tài sản tập trung kết hợp với ứng dụng mã QR trên di động nhằm thay thế quy trình quản lý bằng sổ sách hoặc Excel truyền thống. Hệ thống giúp đơn giản hóa việc tra cứu, kiểm kê, bàn giao, thu hồi và bảo trì tài sản.

### 2. Công dụng thực tế

* **Số hóa dữ liệu:** Lưu trữ toàn bộ thông tin tài sản, vị trí (phòng, khoa, bộ môn) trên cơ sở dữ liệu tập trung.

* **Định danh bằng mã QR:** Mỗi tài sản được cấp một mã QR độc nhất. Khi quét mã dán trên thiết bị bằng camera điện thoại thông thường, người dùng có thể tra cứu ngay lập tức toàn bộ lịch sử và thông số kỹ thuật.

* **Theo dõi vòng đời tài sản:** Quản lý chi tiết từng giai đoạn bàn giao, thu hồi, phân công người sử dụng, lịch sử sửa chữa và tình trạng bảo trì.

* **Tối ưu kiểm kê:** Tiết kiệm thời gian kiểm kê định kỳ và hạn chế tối đa thất thoát tài sản.

## III. CÔNG NGHỆ VÀ NGÔN NGỮ SỬ DỤNG (TECH STACK)

| Thành phần | Công nghệ / Thư viện đề xuất | Ghi chú | 
| ----- | ----- | ----- | 
| **Ngôn ngữ lập trình** | Java | Áp dụng tư duy Lập trình hướng đối tượng (OOP) | 
| **Backend Framework** | Spring Boot | Xây dựng RESTful API  | 
| **Frontend Framework** | ReactJS  | Giao diện quản lý Web và giao diện tra cứu | 
| **Cơ sở dữ liệu** | MySQL | Lưu trữ dữ liệu hệ thống, lịch sử và phân quyền | 
| **Công nghệ QR Code** | Thư viện Java ZXing (Backend)  | Tạo và đọc mã QR chuẩn ISO/IEC 18004 qua camera thiết bị di động | 

## IV. PHÂN TÍCH ĐẦU VÀO VÀ ĐẦU RA (INPUTS & OUTPUTS)

### 1. Đầu vào (Inputs)

* **Thông tin tài sản:** Tên tài sản, loại tài sản, thông số kỹ thuật, ngày nhập, giá trị, vị trí lưu trữ (Khoa, Bộ môn, Phòng học/Phòng làm việc).

* **Thông tin phân quyền & người dùng:** Tài khoản admin, tài khoản nhân viên/sinh viên, vai trò (Role).

* **Dữ liệu quét mã QR:** Dữ liệu hình ảnh/chuỗi định danh được đọc qua camera thiết bị di động.

* **Dữ liệu nghiệp vụ:**

  * Phiếu bàn giao / thu hồi tài sản (Người nhận, người giao, ngày giao/thu hồi).

  * Phiếu báo hỏng, yêu cầu sửa chữa, thông tin chi phí và lịch sử bảo trì.

### 2. Đầu ra (Outputs)

* **Mã QR định danh:** File ảnh QR hoặc dữ liệu mã hiển thị trên giao diện, có thể in ra dán lên tài sản.

* **Giao diện Web Quản lý:**

  * Trang dashboard thống kê số lượng, tỷ lệ tài sản theo trạng thái (*Đang sử dụng, Còn trống, Bảo trì, Hư hỏng*).

  * Danh sách quản lý danh mục tài sản, phân quyền người dùng, lịch sử luân chuyển.

* **Giao diện/App di động (Tra cứu):** Trang/màn hình hiển thị nhanh thông tin tài sản ngay sau khi quét mã QR thành công.

* **Báo cáo & Thống kê:** Xuất lịch sử sửa chữa, danh sách tài sản cần thanh lý hoặc kiểm kê.

## V. CHI TIẾT CÁC CHỨC NĂNG CỐT LÕI

1. **Quản lý danh mục & thông tin tài sản:** Thêm, sửa, xóa, tìm kiếm, lọc tài sản theo khoa/phòng/bộ môn.

2. **Sinh mã QR Code:** Tự động tạo mã QR chứa mã định danh duy nhất (Asset ID) cho từng tài sản mới tạo.

3. **Quét QR Code tra cứu:** Tích hợp camera điện thoại để đọc mã QR và truy xuất trực tiếp thông tin tài sản từ hệ thống.

4. **Quản lý Bàn giao & Thu hồi:** Ghi nhận và lưu vết quá trình luân chuyển tài sản giữa các cá nhân/đơn vị.

5. **Theo dõi Sửa chữa & Bảo trì:** Ghi nhận thông tin hỏng hóc, lịch sử sửa chữa, bảo dưỡng định kỳ.

6. **Thống kê & Kiểm kê:** Báo cáo số lượng tài sản theo các trạng thái: *Đang sử dụng*, *Còn trống*, *Bảo trì*, *Hư hỏng*.

7. **Phân quyền người dùng:** Phân chia rõ ràng quyền hạn giữa Quản trị viên (Admin) và Người sử dụng (User).

## VI. KẾ HOẠCH VÀ TIẾN ĐỘ THỰC HIỆN DỰ ÁN

| Tuần | Thời gian dự kiến | Nội dung công việc | Kết quả dự kiến | 
| ----- | ----- | ----- | ----- | 
| **1** | 19/10/2026 – 25/10/2026 | Khảo sát nhu cầu quản lý bằng Google Forms; nghiên cứu lý thuyết mã QR & cơ sở dữ liệu. | Biểu mẫu khảo sát, tài liệu cơ sở lý thuyết và mô tả thực trạng. | 
| **2** | 09/11/2026 – 15/11/2026 | Phân tích yêu cầu chức năng; thiết kế kiến trúc hệ thống, sơ đồ CSDL (ERD) và phác thảo giao diện. | Danh sách yêu cầu, sơ đồ CSDL, thiết kế Wireframe/UI. | 
| **3** | 30/11/2026 – 06/12/2026 | Xây dựng chức năng Web (Spring Boot + MySQL + ReactJS/Thymeleaf) và tính năng quét/đọc mã QR. | Hệ thống Web hoạt động, chức năng tạo và quét mã QR hoàn thiện. | 
| **4** | 21/12/2026 – 27/12/2026 | Kiểm thử hệ thống, xử lý lỗi, hoàn thiện báo cáo đồ án và chuẩn bị slide thuyết trình. | Sản phẩm hoàn chỉnh, báo cáo đồ án và slide thuyết trình. | 

## VII. GHI CHÚ KỸ THUẬT QUAN TRỌNG FOR AI ASSISTANT

1. **Mã định danh duy nhất:** Mỗi tài sản trong CSDL bắt buộc có một `asset_id` (Primary Key), chuỗi mã QR sẽ chứa `asset_id` này hoặc đường link URL tra cứu trực tiếp dạng `https://domain.com/assets/{asset_id}`.

2. **Không yêu cầu thiết bị phần cứng chuyên dụng:** Khâu quét QR tối ưu trên trình duyệt di động / App thông qua camera sẵn có của điện thoại.

3. **Trạng thái bắt buộc:** CSDL cần định nghĩa bảng enum hoặc lookup table cho các trạng thái tài sản: `IN_USE` (Đang sử dụng), `AVAILABLE` (Còn trống), `MAINTENANCE` (Đang bảo trì), `BROKEN` (Hư hỏng).