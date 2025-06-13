# ZPlus Web - Mock HTML Files

## Tổng quan

Thư mục này chứa các file HTML mock được thiết kế dựa trên tài liệu dự án ZPlus Web. Các file này mô phỏng giao diện người dùng cho cả trang admin và trang chủ của website.

## Cấu trúc file

```
mock/
├── README.md           # File tài liệu này
├── admin.html          # Giao diện Admin Panel
└── home.html           # Giao diện trang chủ
```

## Chi tiết các file

### 1. admin.html - Admin Panel

**Mô tả**: Giao diện quản trị admin với đầy đủ tính năng quản lý hệ thống.

**Tính năng chính**:
- Dashboard tổng quan với thống kê real-time
- Sidebar navigation với các module chính:
  - Dashboard & Analytics
  - Quản lý nội dung (Blog, Projects, Content)
  - Thương mại (Products, Orders, Customers)
  - Hệ thống (WordPress Sync, Settings)
- Cards thống kê với animation
- Bảng dữ liệu hoạt động gần đây
- Quick actions để thêm nội dung mới
- Responsive design cho mobile

**Công nghệ sử dụng**:
- HTML5 semantic markup
- CSS3 với Flexbox & Grid
- Font Awesome icons
- JavaScript vanilla cho tương tác
- Gradient backgrounds & hover effects
- CSS animations

**Màu sắc chủ đạo**:
- Primary: `#667eea` (xanh gradient)
- Secondary: `#764ba2` (tím gradient)
- Success: `#27ae60` (xanh lá)
- Warning: `#f39c12` (cam)
- Background: `#f8f9fa` (xám nhạt)

### 2. home.html - Trang chủ

**Mô tả**: Trang chủ website công ty với thiết kế hiện đại, thể hiện dịch vụ và sản phẩm.

**Sections chính**:
1. **Header/Navigation**: 
   - Logo ZPlus với icon
   - Menu navigation (Trang chủ, Dịch vụ, Sản phẩm, Dự án, Blog, Liên hệ)
   - Buttons đăng nhập/đăng ký

2. **Hero Section**: 
   - Tiêu đề chính về giải pháp công nghệ
   - Call-to-action buttons
   - Background gradient với overlay

3. **Services Section**:
   - 4 dịch vụ chính: Web Development, Mobile Apps, E-commerce, Consulting
   - Cards với icons và hover effects

4. **Products Section**:
   - 3 sản phẩm phần mềm: CRM Pro, Inventory, Analytics
   - Product cards với pricing và features
   - Buttons mua hàng

5. **Blog Section**:
   - 3 bài viết mới nhất
   - Meta info (ngày, tác giả)
   - Read more links

6. **CTA Section**:
   - Call-to-action cuối trang
   - Liên hệ và xem portfolio

7. **Footer**:
   - 4 cột thông tin: Công ty, Dịch vụ, Sản phẩm, Liên hệ
   - Social media links
   - Copyright info

**Tính năng JavaScript**:
- Smooth scrolling navigation
- Header background change on scroll
- Hover effects cho cards
- Mobile menu toggle
- Intersection Observer animations
- Interactive elements

**Responsive Design**:
- Mobile-first approach
- Breakpoint chính tại 768px
- Flexible grid layouts
- Mobile navigation menu

## Cách sử dụng

### Xem trực tiếp

1. **Admin Panel**:
```bash
open /Volumes/DATA/project/zplus_web/mock/admin.html
```

2. **Trang chủ**:
```bash
open /Volumes/DATA/project/zplus_web/mock/home.html
```

### Chạy với local server

```bash
# Chuyển đến thư mục mock
cd /Volumes/DATA/project/zplus_web/mock

# Chạy simple HTTP server
python3 -m http.server 8000

# Hoặc với Node.js
npx http-server -p 8000

# Truy cập:
# Admin: http://localhost:8000/admin.html
# Home: http://localhost:8000/home.html
```

## Thiết kế & UX

### Nguyên tắc thiết kế
- **Modern & Clean**: Giao diện sạch sẽ, hiện đại
- **Professional**: Phù hợp với doanh nghiệp công nghệ
- **User-friendly**: Dễ sử dụng và điều hướng
- **Responsive**: Hoạt động tốt trên mọi thiết bị

### Color Scheme
- **Primary Gradient**: `#667eea` → `#764ba2`
- **Accent**: `#f1c40f` (vàng)
- **Success**: `#27ae60` (xanh lá)
- **Text**: `#2c3e50` (xám đậm)
- **Background**: `#f8f9fa` (xám nhạt)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Font-weight 700, sizes từ 1.2rem - 3.5rem
- **Body text**: Font-weight 400, line-height 1.6

### Interactions
- **Hover Effects**: Transform, box-shadow, color changes
- **Smooth Transitions**: 0.3s ease cho mọi transition
- **Scroll Animations**: fadeInUp animation với Intersection Observer
- **Active States**: Visual feedback cho user actions

## Tích hợp với dự án chính

Các file mock này được thiết kế để:

1. **Reference cho Frontend Development**: 
   - Cung cấp design pattern cho Next.js components
   - Color scheme và typography standards
   - Layout structures và spacing

2. **UI/UX Guidelines**:
   - Component behavior và interactions
   - Responsive breakpoints
   - Animation patterns

3. **Content Structure**:
   - Information architecture
   - Menu navigation structure
   - Data presentation patterns

## Next Steps

1. **Convert to React Components**: Chuyển đổi HTML thành Next.js components
2. **Integrate with GraphQL**: Kết nối với backend API
3. **Add State Management**: Implement Redux/Zustand cho state
4. **Authentication Flow**: Tích hợp JWT authentication
5. **Performance Optimization**: Image optimization, code splitting
6. **SEO Optimization**: Meta tags, structured data

## Screenshots & Demo

Để xem demo trực quan, mở các file HTML trong browser:
- `admin.html` - Giao diện quản trị đầy đủ tính năng
- `home.html` - Trang chủ chuyên nghiệp với animation

## Compatibility

- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: CSS Grid, Flexbox, ES6+, Intersection Observer

---

**Developed by**: ZPlus Web Team  
**Last Updated**: June 13, 2025  
**Version**: 1.0.0
