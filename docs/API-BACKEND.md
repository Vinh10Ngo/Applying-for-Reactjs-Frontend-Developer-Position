# Kết nối Backend API

Frontend đã cấu hình theo **đặc tả backend** (Base URL: `http://localhost:3000/api/v1`).

- **Swagger:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs) — xem chi tiết request/response từng endpoint.

## Cấu hình Frontend

- **Development:** `.env.development` hoặc `.env` với `VITE_API_URL=http://localhost:3000/api/v1`
- **Production:** `VITE_API_URL=https://your-api-domain.com/api/v1`

Sau khi sửa `.env`, cần **khởi động lại** `npm run dev`.

## Cách Frontend gọi API

| Chức năng           | Method | Endpoint                    | Ghi chú |
|---------------------|--------|-----------------------------|--------|
| Đăng ký             | POST   | `/auth/register`            | body: email, password, fullName |
| Đăng nhập           | POST   | `/auth/login`               | body: email, password → lưu access_token, refresh_token, user |
| Refresh token       | POST   | `/auth/refresh`             | body: refresh_token (tự gọi khi 401) |
| Logout              | POST   | `/auth/logout`              | body: refresh_token (gọi khi đăng xuất) |
| Đổi mật khẩu        | POST   | `/auth/change-password`     | Bearer, body: currentPassword, newPassword |
| Thông tin tôi       | GET    | `/users/me`                 | Bearer |
| Danh sách user (admin) | GET | `/users` | Bearer, role admin. Có thể hỗ trợ `page`, `limit`, `search_term`. |
| Đổi vai trò user (admin) | PATCH | `/users/:id` | Bearer, body: `{ "role": "admin" }` hoặc `{ "role": "user" }`. |
| Danh sách bài       | GET    | `/articles?page=&limit=&published=&search_term=` | public |
| Chi tiết bài        | GET    | `/articles/:id`             | public |
| Bài của tôi         | GET    | `/articles/me`              | Bearer |
| Tạo bài             | POST   | `/articles`                 | Bearer, body: title, content?, published? |
| Sửa bài             | PUT    | `/articles/:id`             | Bearer, body: title, content?, published? |
| Xóa bài             | DELETE | `/articles/:id`            | Bearer (xóa mềm) |
| Khôi phục bài       | PATCH  | `/articles/:id/restore`     | Bearer |
| Admin: tất cả bài   | GET    | `/articles/admin?page=&limit=&search_term=` | Bearer. `limit` tối đa 50. Trả về nháp, đã xuất bản, đã xóa. |

## Token

- Lưu `access_token` và `refresh_token` (localStorage).
- Mọi request cần auth gửi header: `Authorization: Bearer <access_token>`.
- Khi gặp **401**, frontend tự gọi `POST /auth/refresh` với `refresh_token` để lấy `access_token` mới và gửi lại request. Nếu refresh thất bại → xóa token và chuyển về trạng thái chưa đăng nhập.

## API cho màn hình Quản trị (Admin)

- **Quản lý người dùng:** `GET /users` (danh sách; response có thể là mảng `[{ id, email, fullName, name, role }]`), `PATCH /users/:id` (body: `{ "role": "admin" }` hoặc `{ "role": "user" }`).
- **Quản lý bài viết:** `GET /articles/admin?page=1&limit=10&search_term=...` (phân trang + tìm kiếm; response: `{ items, total, page, limit, totalPages }`; mỗi bài có thể có `authorId: { _id, email, fullName }`), `PUT /articles/:id`, `DELETE /articles/:id`, `PATCH /articles/:id/restore`.

## CORS

Backend cần bật CORS cho origin của frontend (vd: `http://localhost:5173`). Production nên giới hạn `origin` theo domain frontend.
