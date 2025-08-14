# Jetwash API Documentation

Server đang chạy tại: `http://localhost:1236`

## Company API Endpoints

### 1. Lấy thông tin công ty

- **GET** `/company/info`
- **Description**: Lấy thông tin công ty
- **Response**:

```json
{
  "success": true,
  "message": "Lấy thông tin công ty thành công",
  "data": {
    "id": 1,
    "name": "Công ty TNHH Jetwash",
    "logo_url": "/images/logo.png",
    "intro_text": "Chuyên cung cấp dịch vụ rửa xe chất lượng cao với công nghệ hiện đại",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "tax_code": "0123456789",
    "email": "info@jetwash.com",
    "welcome_content": "Chào mừng bạn đến với Jetwash - Dịch vụ rửa xe hàng đầu",
    "version_info": 1,
    "contact_id": 1,
    "img_intro": "Hình ảnh giới thiệu công ty Jetwash",
    "created_at": "2025-01-14T16:20:30.000Z",
    "updated_at": "2025-01-14T16:20:30.000Z"
  }
}
```

### 2. Cập nhật thông tin công ty

- **PUT** `/company/info`
- **Body**:

```json
{
  "name": "Công ty TNHH Jetwash Updated",
  "logo_url": "/images/new-logo.png",
  "intro_text": "Dịch vụ rửa xe chất lượng cao",
  "address": "456 Đường XYZ, Quận 2, TP.HCM",
  "tax_code": "0123456789",
  "email": "contact@jetwash.com",
  "welcome_content": "Chào mừng đến với Jetwash",
  "img_intro": "Hình ảnh mới"
}
```

### 3. Lấy thông tin liên hệ

- **GET** `/company/contact`
- **Response**:

```json
{
  "success": true,
  "message": "Lấy thông tin liên hệ thành công",
  "data": {
    "id": 1,
    "facebook_link": "https://facebook.com/jetwash",
    "tiktok_link": "https://tiktok.com/@jetwash",
    "zalo_link": "https://zalo.me/jetwash",
    "phone": "0123456789",
    "created_at": "2025-01-14T16:20:30.000Z"
  }
}
```

### 4. Lấy danh sách dịch vụ

- **GET** `/company/services`
- **Response**:

```json
{
  "success": true,
  "message": "Lấy danh sách dịch vụ thành công",
  "data": [
    {
      "id": 1,
      "title": "Rửa xe ô tô cơ bản",
      "description": "Dịch vụ rửa xe ô tô cơ bản với quy trình chuyên nghiệp",
      "image_url": "/images/service1.jpg",
      "created_at": "2025-01-14T16:20:30.000Z",
      "is_delete": 0,
      "company_id": 1
    }
  ]
}
```

### 5. Thêm dịch vụ mới

- **POST** `/company/services`
- **Body**:

```json
{
  "title": "Dịch vụ mới",
  "description": "Mô tả dịch vụ",
  "image_url": "/images/service-new.jpg",
  "company_id": 1
}
```

### 6. Lưu thông tin liên hệ khách hàng

- **POST** `/company/contact/customer`
- **Body**:

```json
{
  "full_name": "Nguyễn Văn A",
  "phone_customer": "0987654321",
  "message": "Tôi muốn tư vấn dịch vụ rửa xe"
}
```

### 7. Lấy footer links

- **GET** `/company/footer-links`

## Test với curl

```bash
# Lấy thông tin công ty
curl http://localhost:1236/company/info

# Lấy thông tin liên hệ
curl http://localhost:1236/company/contact

# Lấy danh sách dịch vụ
curl http://localhost:1236/company/services

# Thêm liên hệ khách hàng
curl -X POST http://localhost:1236/company/contact/customer \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "phone_customer": "0123456789",
    "message": "Test message"
  }'
```

## Database Schema

Các bảng đã được tạo trong database `jetwash`:

1. **company_info** - Thông tin công ty
2. **contact_company** - Thông tin liên hệ công ty
3. **services** - Danh sách dịch vụ
4. **footer_links** - Links footer
5. **contact_customer** - Thông tin liên hệ từ khách hàng

## Environment Configuration

File `.env.development` đã được cấu hình với:

- MySQL Host: localhost
- MySQL Port: 3306
- MySQL Database: jetwash
- MySQL Username: root
- MySQL Password: (trống)
