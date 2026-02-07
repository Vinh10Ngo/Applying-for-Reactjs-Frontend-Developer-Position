# Hướng dẫn Deploy Frontend

App là SPA (React + Vite), build ra file tĩnh trong thư mục `dist/`. Có thể deploy lên bất kỳ host tĩnh nào.

---

## 1. Build trên máy

```bash
npm install
npm run build
```

- Thư mục **`dist/`** sẽ chứa `index.html` và các file JS/CSS. Đây là toàn bộ thứ cần đẩy lên host.

---

## 2. Biến môi trường (Production API)

- App dùng **`VITE_API_URL`** để biết gọi API ở đâu.
- **Không set** (hoặc để trống) → dùng **mock** (localStorage, không cần backend).
- **Có set** (vd: `https://your-api.com/api/v1`) → gọi API thật. Backend cần **bật CORS** cho domain frontend (vd: `https://your-app.vercel.app`).

Trên từng nền tảng bên dưới, cấu hình **Environment Variable** / **Build env** với key **`VITE_API_URL`** và value là URL API của bạn.

---

## 3. Vercel (nhanh, miễn phí)

1. Vào [vercel.com](https://vercel.com), đăng nhập (GitHub).
2. **Add New** → **Project** → import repo GitHub (vd: `Vinh10Ngo/Applying-for-Reactjs-Frontend-Developer-Position`).
3. **Framework Preset:** Vite (tự nhận).
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:** thêm `VITE_API_URL` = URL API (nếu dùng backend).
7. **Deploy.**

Sau mỗi lần push lên `main`, Vercel tự build và deploy. URL dạng: `https://tên-project.vercel.app`.

---

## 4. Netlify

1. Vào [netlify.com](https://netlify.com), đăng nhập, **Add new site** → **Import an existing project** (GitHub).
2. Chọn repo, nhánh `main`.
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. **Environment variables:** thêm `VITE_API_URL` nếu cần.
6. **Deploy site.**

Để SPA (React Router) không lỗi 404 khi refresh: **Site settings** → **Build & deploy** → **Post processing** → **Asset optimization** (hoặc thêm file **`public/_redirects`** với nội dung: `/* /index.html 200`).

Tạo file `public/_redirects`:
```
/*    /index.html   200
```

---

## 5. GitHub Pages

1. Trong repo GitHub: **Settings** → **Pages** → **Source:** Deploy from a branch.
2. Chọn branch `main`, folder **`/ (root)`** hoặc **GitHub Actions** (khuyến nghị dùng Actions để build Vite).

**Cách 1 – Build local rồi push `dist/`:**  
- Chạy `npm run build`, push thư mục `dist/` lên nhánh `gh-pages` hoặc dùng branch `main` với folder `docs` (cấu hình Pages dùng folder `docs` và đặt build output vào `docs` – phức tạp hơn).

**Cách 2 – GitHub Actions (tự build khi push):**  
- Tạo file **`.github/workflows/deploy.yml`** trong repo:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- Trong **Settings** → **Pages**: Source = **GitHub Actions**. Push lên `main` → workflow chạy và đẩy `dist/` lên Pages. URL: `https://<username>.github.io/<repo-name>/`.

- **Lưu ý:** Nếu deploy vào subpath (vd: `/Applying-for-Reactjs-Frontend-Developer-Position/`), cần cấu hình **base** trong `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/Applying-for-Reactjs-Frontend-Developer-Position/',
})
```

Rồi build lại. Nếu repo dùng custom domain và deploy ở root thì `base: '/'` (mặc định).

---

## 6. Xem bản build trước khi deploy

```bash
npm run build
npm run preview
```

Mở URL local (vd: `http://localhost:4173`) để kiểm tra. Nhớ test với **`VITE_API_URL`** đúng (hoặc không set để test mock).
