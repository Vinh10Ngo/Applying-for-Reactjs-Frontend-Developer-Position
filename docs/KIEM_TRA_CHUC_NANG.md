# Kiểm tra chức năng giao diện web

Dùng bảng dưới để test thủ công sau khi chạy `npm run dev` và mở http://localhost:5173

**Đánh giá code (logic):** Route bảo vệ (ProtectedRoute, AdminRoute), Auth mock/API, bài nháp/chưa đăng nhập không xem được, TOC + Reading progress bar, Admin user/bài (tìm, phân trang, đặt admin) đã có trong code. Cần test thủ công theo bảng dưới để xác nhận trên trình duyệt.

---

## 1. Đăng ký / Đăng nhập

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 1.1 | Đăng ký | Vào **Đăng ký** → nhập tên, email, mật khẩu → **Đăng ký** → chuyển về trang chủ, có email trên nav | |
| 1.2 | Đăng nhập | Đăng xuất → **Đăng nhập** → email + mật khẩu → vào được trang chủ | |
| 1.3 | Đăng nhập sai | Nhập sai mật khẩu → hiện thông báo lỗi | |
| 1.4 | Đăng xuất | Bấm **Đăng xuất** → về trang chủ, nav chỉ còn Đăng nhập / Đăng ký | |

---

## 2. Trang chủ

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 2.1 | Danh sách bài | Trang chủ hiển thị danh sách bài đã xuất bản (hoặc "Chưa có bài viết nào") | |
| 2.2 | Tìm kiếm | Gõ từ khóa vào ô tìm → Enter hoặc đợi → danh sách lọc theo tiêu đề/nội dung | |
| 2.3 | Phân trang | Nếu có > 10 bài: có nút **Trước** / **Sau**, bấm chuyển trang đúng | |
| 2.4 | Link Admin (chỉ admin) | Đăng nhập **admin@test.com** / **admin123** → thấy **Quản trị →** và link **Admin** trên nav | |
| 2.5 | User thường | Đăng nhập user thường → không thấy **Quản trị →** và **Admin** | |

---

## 3. Bài viết

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 3.1 | Xem bài | Bấm vào một bài → vào trang chi tiết, có tiêu đề, tác giả, nội dung | |
| 3.2 | Mục lục (TOC) | Bài có heading `##`, `###` → có khối **Mục lục** bên trái/trên, bấm link scroll đúng | |
| 3.3 | Reading progress bar | Kéo xuống đọc bài → thanh cam trên cùng dài theo % đã đọc | |
| 3.4 | Viết bài mới | **Viết bài** → điền tiêu đề, nội dung, bật **Đã xuất bản** → **Tạo bài** → chuyển sang trang bài vừa tạo | |
| 3.5 | Sửa bài | Vào bài của mình → **Sửa bài** → sửa → **Lưu** → nội dung cập nhật | |
| 3.6 | Bài chưa xuất bản | Bài nháp: user khác không xem được; tác giả/admin xem được và thấy cảnh báo "Bản nháp" | |

---

## 4. Cá nhân / Bài của tôi

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 4.1 | Trang cá nhân | **Cá nhân** → thấy email, tên, vai trò | |
| 4.2 | Đổi mật khẩu | **Cá nhân** → nhập mật khẩu hiện tại + mật khẩu mới → **Đổi mật khẩu** → thấy thông báo thành công | |
| 4.3 | Bài của tôi | **Bài của tôi** → thấy danh sách bài do mình tạo, có **Sửa** / **Xóa** | |
| 4.4 | Xóa bài (soft) | **Xóa** một bài → xác nhận → bài biến mất khỏi "Bài của tôi", vẫn thấy ở Admin (đã xóa) | |

---

## 5. Admin

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 5.1 | Vào Admin | **Admin** (hoặc **Quản trị →**) → trang **Quản trị** với 2 thẻ: Quản lý người dùng, Quản lý bài viết | |
| 5.2 | Danh sách user | **Quản lý người dùng** → bảng user (email, tên, vai trò) | |
| 5.3 | Tìm user | Gõ email/tên → **Tìm** → danh sách lọc đúng | |
| 5.4 | Phân trang user | Nếu nhiều user: nút **Trước** / **Sau** chuyển trang đúng | |
| 5.5 | Đặt / Bỏ admin | **Đặt làm admin** hoặc **Bỏ admin** → xác nhận → vai trò đổi, (nếu đổi chính mình thì nav cập nhật) | |
| 5.6 | Quản lý bài viết | **Quản lý bài viết** → thấy tất cả bài (đã xuất bản, nháp, đã xóa) | |
| 5.7 | Tìm bài (admin) | Gõ từ khóa → **Tìm** → danh sách bài lọc đúng | |
| 5.8 | Phân trang bài (admin) | Nút **Trước** / **Sau** chuyển trang đúng | |
| 5.9 | Khôi phục bài | Với bài đã xóa: **Khôi phục** → bài không còn trạng thái "đã xóa" | |

---

## 6. Bảo vệ route

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 6.1 | Chưa đăng nhập vào trang cần auth | Đăng xuất → truy cập `/profile` hoặc `/articles/new` → chuyển về **Đăng nhập** | |
| 6.2 | User thường vào Admin | Đăng nhập user (không phải admin) → vào `/admin` → chuyển về trang chủ | |

---

## 7. Giao diện / UX

| # | Chức năng | Cách kiểm tra | OK? |
|---|-----------|----------------|-----|
| 7.1 | Navbar | Link rõ ràng, đúng trang; có email user khi đã đăng nhập | |
| 7.2 | Trang bài viết (layout) | Nội dung bài không bị kẹt cột nhỏ; không còn vùng đen thừa | |
| 7.3 | Form | Label, placeholder, nút submit; lỗi hiển thị màu đỏ | |
| 7.4 | Responsive | Thu nhỏ cửa sổ → nav và nội dung vẫn dùng được | |

---

## Ghi chú

- **Mock (không backend):** Xóa hoặc để trống `VITE_API_URL` trong `.env.development`, chạy lại `npm run dev`. Tài khoản mẫu: **admin@test.com** / **admin123**, **user@test.com** / **user123**.
- **Backend thật:** Set `VITE_API_URL=http://localhost:3000/api/v1` (hoặc URL backend của bạn), đảm bảo backend đang chạy và CORS cho phép origin frontend.
