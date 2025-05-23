# Musi

Musi là một ứng dụng web nghe nhạc với các chức năng quản lý bài hát, album, người dùng và thống kê dành cho admin.

## Chức năng chính

- Đăng ký, đăng nhập người dùng
- Nghe nhạc trực tuyến
- Quản lý bài hát: thêm, xóa (admin)
- Quản lý album: thêm, xóa (admin)
- Thống kê số lượng người dùng, bài hát, album (admin)
- Tìm kiếm bài hát, album
- Thêm bài hát vào danh sách yêu thích

## Công nghệ sử dụng

- Backend: Node.js, Express, MongoDB, Cloudinary
- Frontend: React, TypeScript, Vite, TailwindCSS
- Xác thực: Clerk

## Cài đặt

### 1. Clone dự án

```sh
git clone https://github.com/tcnguywn/Musi.git
cd Musi
```

### 2. Cài đặt dependencies

```sh
npm install
```

### 3. Cài đặt backend

```sh
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend` và cấu hình các biến môi trường cần thiết (ví dụ: MONGODB_URI, CLOUDINARY, ADMIN_EMAIL, ...).

### 4. Cài đặt frontend

```sh
cd ../frontend
npm install
```

Tạo file `.env.local` trong thư mục `frontend` nếu cần cấu hình thêm.

### 5. Build frontend

```sh
npm run build
```

### 6. Chạy dự án

Quay lại thư mục gốc và chạy:

```sh
npm run start
```

- Backend chạy ở cổng (port) được cấu hình trong `.env`
- Frontend chạy ở http://localhost:3000

---

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo pull request hoặc issue nếu bạn có ý tưởng hoặc phát hiện lỗi.

## License
