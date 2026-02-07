# Xin việc - Frontend (React + Vite)

Ứng dụng React cơ bản dùng Vite.

## Cài Node.js (bắt buộc để chạy project)

1. Vào **[https://nodejs.org](https://nodejs.org)** → nút **LTS** (Recommended).
2. Chạy file `.msi` vừa tải → Next → **chọn "Add to PATH"** → Install.
3. Cài xong: **đóng hết terminal**, mở terminal mới (hoặc mở lại Cursor).
4. Kiểm tra trong terminal mới:
   ```bash
   node -v
   npm -v
   ```
5. Vào thư mục project, chạy:
   ```bash
   npm install
   npm run dev
   ```
   Mở trình duyệt: **http://localhost:5173**

Nếu vẫn báo "node is not recognized": **Cài đặt Windows** → **Hệ thống** → **Giới thiệu** → **Cài đặt hệ thống nâng cao** → **Biến môi trường** → trong **Path** thêm `C:\Program Files\nodejs` → OK → mở lại terminal.

## Cài đặt

**Nếu npm bị lỗi** (sau khi `node` đã chạy được) trên máy bạn, có thể:

1. **Sửa npm**: Cài lại Node.js từ [nodejs.org](https://nodejs.org) (chọn LTS), hoặc chạy:
   ```bash
   node -v
   where npm
   ```
   rồi sửa/cài lại npm theo hướng dẫn của Node.

2. **Dùng Yarn**: Cài Yarn rồi chạy:
   ```bash
   yarn install
   yarn dev
   ```

3. **Dùng pnpm**: Bật Corepack (cần quyền admin) rồi:
   ```bash
   corepack enable
   pnpm install
   pnpm dev
   ```

Khi đã có npm hoặc yarn/pnpm hoạt động, trong thư mục project chạy:

```bash
npm install
npm run dev
```

Mở trình duyệt tại: http://localhost:5173

## Kết nối Backend

Mặc định app chạy với **dữ liệu mock** (localStorage). Để dùng backend thật:

1. Tạo file **`.env`** trong thư mục project (copy từ `.env.example`):
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
   Thay `http://localhost:3000/api` bằng URL API backend của bạn (không slash ở cuối).

2. **Khởi động lại** dev server (`npm run dev` hoặc `.\npm-install-and-run.ps1 run dev`).

3. Backend cần **bật CORS** cho origin của frontend (vd: `http://localhost:5173`).  
   Chi tiết endpoint và format request/response xem trong **`docs/API-BACKEND.md`**.

## Scripts

- `npm run dev` — Chạy dev server
- `npm run build` — Build production (ra thư mục `dist/`)
- `npm run preview` — Xem bản build local

## Deploy lên mạng

1. **Build:** Trong thư mục project chạy `npm run build` → thư mục `dist/` chứa file tĩnh.
2. **Host:** Đẩy `dist/` lên bất kỳ host tĩnh nào (Vercel, Netlify, GitHub Pages, …).
3. **API production:** Trên host, cấu hình biến môi trường **`VITE_API_URL`** = URL API backend (vd: `https://api.example.com/api/v1`). Build lại trên host hoặc set env trước khi build.

Chi tiết từng bước cho **Vercel**, **Netlify**, **GitHub Pages** xem **`docs/DEPLOY.md`**.
