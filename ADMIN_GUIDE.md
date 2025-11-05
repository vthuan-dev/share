# Hệ Thống Admin - Phê Duyệt Người Dùng

## Tính năng mới

### 1. Đăng ký tài khoản cần phê duyệt
- Khi user đăng ký, tài khoản sẽ ở trạng thái **chờ phê duyệt**
- User không thể đăng nhập cho đến khi admin phê duyệt
- Thông báo rõ ràng về trạng thái chờ duyệt

### 2. Trang Admin
- **Chỉ admin** mới có quyền truy cập
- Hiển thị danh sách user chờ duyệt
- Xem tất cả user trong hệ thống
- Phê duyệt hoặc từ chối user

### 3. Phân quyền
- **User**: Người dùng thông thường
- **Admin**: Quản trị viên có quyền duyệt user

## Cách sử dụng

### Tạo tài khoản Admin đầu tiên

```bash
cd backend
npm run create-admin
```

Thông tin admin mặc định:
- **Email**: admin@example.com
- **Password**: admin123456
- ⚠️ Hãy đổi mật khẩu sau lần đăng nhập đầu tiên

### Đăng nhập Admin

1. Vào trang đăng nhập
2. Nhập email: `admin@example.com`
3. Nhập password: `admin123456`
4. Vào tab **Tài Khoản** → Click **Quản trị viên**

### Phê duyệt User

1. Trong trang Admin, xem tab **Chờ duyệt**
2. Click nút **Phê duyệt** (màu xanh) để cho phép user đăng nhập
3. Click nút **Từ chối** (màu đỏ) để xóa user

### API Endpoints mới

#### Admin APIs (yêu cầu role admin)
- `GET /api/admin/users/pending` - Danh sách user chờ duyệt
- `GET /api/admin/users` - Tất cả user
- `POST /api/admin/users/:userId/approve` - Phê duyệt user
- `DELETE /api/admin/users/:userId/reject` - Từ chối và xóa user

#### Thay đổi Auth APIs
- `POST /api/auth/register` - Trả về `{pending: true}` thay vì token
- `POST /api/auth/login` - Kiểm tra `isApproved` trước khi login

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  isApproved: Boolean (default: false),  // ← MỚI
  role: String ('user' | 'admin'),       // ← MỚI
  createdAt: Date,
  updatedAt: Date
}
```

## Flow đăng ký mới

1. User đăng ký → Backend tạo user với `isApproved: false`
2. Frontend hiển thị: "Đăng ký thành công! Vui lòng đợi admin phê duyệt"
3. User thử đăng nhập → Backend trả lỗi: "Tài khoản chưa được phê duyệt"
4. Admin vào trang quản trị → Phê duyệt user
5. User đăng nhập thành công ✅

## Bảo mật

- Tất cả API admin được bảo vệ bởi middleware `requireAdmin`
- Kiểm tra JWT token và role trong token payload
- User thường không thể truy cập API admin
