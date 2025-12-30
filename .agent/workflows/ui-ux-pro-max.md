---
description: Lên kế hoạch và triển khai UI
auto_execution_mode: 3
---

# UI/UX Pro Max - Trí tuệ Thiết kế

Cơ sở dữ liệu có thể tìm kiếm về các phong cách UI, bảng màu, cặp phông chữ, loại biểu đồ, đề xuất sản phẩm, hướng dẫn UX và các phương pháp hay nhất cụ thể cho từng stack công nghệ.

## Điều kiện tiên quyết

Kiểm tra xem Python đã được cài đặt chưa:

```bash
python3 --version || python --version
```

Nếu Python chưa được cài đặt, hãy cài đặt dựa trên hệ điều hành của người dùng:

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## Cách sử dụng Workflow này

Khi người dùng yêu cầu công việc UI/UX (thiết kế, xây dựng, tạo, triển khai, đánh giá, sửa lỗi, cải thiện), hãy làm theo quy trình này:

### Bước 1: Phân tích Yêu cầu Người dùng

Trích xuất thông tin chính từ yêu cầu của người dùng:
- **Loại sản phẩm**: SaaS, thương mại điện tử, portfolio, bảng điều khiển (dashboard), trang đích (landing page), v.v.
- **Từ khóa phong cách**: tối giản, vui tươi, chuyên nghiệp, thanh lịch, chế độ tối (dark mode), v.v.
- **Ngành nghề**: y tế, công nghệ tài chính (fintech), game, giáo dục, v.v.
- **Stack**: React, Vue, Next.js, hoặc mặc định là `html-tailwind`

### Bước 2: Tìm kiếm các Domain liên quan

Sử dụng `search.py` nhiều lần để thu thập thông tin toàn diện. Tìm kiếm cho đến khi bạn có đủ ngữ cảnh.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<từ khóa>" --domain <domain> [-n <kết quả tối đa>]
```

**Thứ tự tìm kiếm được đề xuất:**

1. **Product** - Nhận đề xuất phong cách cho loại sản phẩm
2. **Style** - Nhận hướng dẫn phong cách chi tiết (màu sắc, hiệu ứng, framework)
3. **Typography** - Nhận các cặp phông chữ với import Google Fonts
4. **Color** - Nhận bảng màu (Chính, Phụ, CTA, Nền, Văn bản, Viền)
5. **Landing** - Nhận cấu trúc trang (nếu là landing page)
6. **Chart** - Nhận đề xuất biểu đồ (nếu là dashboard/analytics)
7. **UX** - Nhận các phương pháp hay nhất và các mẫu cần tránh (anti-patterns)
8. **Stack** - Nhận hướng dẫn cụ thể cho stack (mặc định: html-tailwind)

### Bước 3: Hướng dẫn Stack (Mặc định: html-tailwind)

Nếu người dùng không chỉ định stack, **mặc định là `html-tailwind`**.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<từ khóa>" --stack html-tailwind
```

Các stack có sẵn: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`

---

## Tham khảo Tìm kiếm

### Các Domain có sẵn

| Domain | Dùng cho | Ví dụ từ khóa |
|--------|---------|------------------|
| `product` | Đề xuất loại sản phẩm | SaaS, e-commerce, healthcare, beauty, service |
| `style` | Phong cách UI, màu sắc, hiệu ứng | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | Cặp phông chữ, Google Fonts | elegant, playful, professional, modern |
| `color` | Bảng màu theo loại sản phẩm | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | Cấu trúc trang, chiến lược CTA | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | Loại biểu đồ, thư viện đề xuất | trend, comparison, timeline, funnel, pie |
| `ux` | Phương pháp hay nhất, anti-patterns | animation, accessibility, z-index, loading |
| `prompt` | AI prompts, từ khóa CSS | (tên phong cách) |

### Các Stack có sẵn

| Stack | Trọng tâm |
|-------|-------|
| `html-tailwind` | Tiện ích Tailwind, responsive, hỗ trợ truy cập (MẶC ĐỊNH) |
| `react` | State, hooks, hiệu năng, mẫu thiết kế (patterns) |
| `nextjs` | SSR, routing, hình ảnh, API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `swiftui` | Views, State, Navigation, Animation |
| `react-native` | Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |

---

## Ví dụ Workflow

**Yêu cầu người dùng:** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

**AI nên:**

```bash
# 1. Tìm kiếm loại sản phẩm
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --domain product

# 2. Tìm kiếm phong cách (dựa trên ngành: làm đẹp, thanh lịch)
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant minimal soft" --domain style

# 3. Tìm kiếm typography
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant luxury" --domain typography

# 4. Tìm kiếm bảng màu
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --domain color

# 5. Tìm kiếm cấu trúc landing page
python3 .shared/ui-ux-pro-max/scripts/search.py "hero-centric social-proof" --domain landing

# 6. Tìm kiếm hướng dẫn UX
python3 .shared/ui-ux-pro-max/scripts/search.py "animation" --domain ux
python3 .shared/ui-ux-pro-max/scripts/search.py "accessibility" --domain ux

# 7. Tìm kiếm hướng dẫn stack (mặc định: html-tailwind)
python3 .shared/ui-ux-pro-max/scripts/search.py "layout responsive" --stack html-tailwind
```

**Sau đó:** Tổng hợp tất cả kết quả tìm kiếm và triển khai thiết kế.

---

## Mẹo để có Kết quả Tốt hơn

1. **Cụ thể với từ khóa** - "healthcare SaaS dashboard" > "app"
2. **Tìm kiếm nhiều lần** - Các từ khóa khác nhau tiết lộ thông tin chi tiết khác nhau
3. **Kết hợp các domain** - Style + Typography + Color = Hệ thống thiết kế hoàn chỉnh
4. **Luôn kiểm tra UX** - Tìm kiếm "animation", "z-index", "accessibility" cho các vấn đề phổ biến
5. **Sử dụng cờ stack** - Nhận các phương pháp hay nhất cụ thể cho việc triển khai
6. **Lặp lại** - Nếu tìm kiếm đầu tiên không khớp, thử các từ khóa khác
7. **Chia thành nhiều tệp** - Để dễ bảo trì hơn:
   - Tách các components thành các tệp riêng lẻ (ví dụ: `Header.tsx`, `Footer.tsx`)
   - Tách các style tái sử dụng thành các tệp chuyên dụng
   - Giữ mỗi tệp tập trung và dưới 200-300 dòng

---

## Các Quy tắc Chung cho UI Chuyên nghiệp

Đây là những vấn đề thường bị bỏ qua khiến UI trông thiếu chuyên nghiệp:

### Biểu tượng & Yếu tố Trực quan

| Quy tắc | Nên làm | Không nên làm |
|------|----|----- |
| **Không dùng biểu tượng emoji** | Sử dụng SVG icons (Heroicons, Lucide, Simple Icons) | Sử dụng emojis như 🎨 🚀 ⚙️ làm icon UI |
| **Trạng thái hover ổn định** | Sử dụng chuyển đổi màu/độ mờ khi hover | Sử dụng biến đổi tỷ lệ (scale) làm lệch bố cục |
| **Logo thương hiệu chính xác** | Tìm kiếm SVG chính thức từ Simple Icons | Đoán hoặc sử dụng đường dẫn logo sai |
| **Kích thước icon nhất quán** | Sử dụng viewBox cố định (24x24) với w-6 h-6 | Trộn các kích thước icon khác nhau ngẫu nhiên |

### Tương tác & Con trỏ

| Quy tắc | Nên làm | Không nên làm |
|------|----|----- |
| **Con trỏ pointer** | Thêm `cursor-pointer` cho tất cả các thẻ có thể click/hover | Để con trỏ mặc định trên các yếu tố tương tác |
| **Phản hồi hover** | Cung cấp phản hồi trực quan (màu sắc, bóng, viền) | Không có dấu hiệu nào cho thấy yếu tố có thể tương tác |
| **Chuyển đổi mượt mà** | Sử dụng `transition-colors duration-200` | Thay đổi trạng thái tức thì hoặc quá chậm (>500ms) |

### Độ tương phản Sáng/Tối

| Quy tắc | Nên làm | Không nên làm |
|------|----|----- |
| **Thẻ kính chế độ sáng** | Sử dụng `bg-white/80` hoặc độ mờ cao hơn | Sử dụng `bg-white/10` (quá trong suốt) |
| **Tương phản văn bản sáng** | Sử dụng `#0F172A` (slate-900) cho văn bản | Sử dụng `#94A3B8` (slate-400) cho văn bản nội dung |
| **Văn bản mờ chế độ sáng** | Sử dụng `#475569` (slate-600) tối thiểu | Sử dụng gray-400 hoặc sáng hơn |
| **Hiển thị viền** | Sử dụng `border-gray-200` ở chế độ sáng | Sử dụng `border-white/10` (vô hình) |

### Bố cục & Khoảng cách

| Quy tắc | Nên làm | Không nên làm |
|------|----|----- |
| **Thanh điều hướng nổi** | Thêm khoảng cách `top-4 left-4 right-4` | Dính thanh điều hướng vào `top-0 left-0 right-0` |
| **Padding nội dung** | Tính toán chiều cao thanh điều hướng cố định | Để nội dung bị ẩn sau các yếu tố cố định |
| **Chiều rộng tối đa nhất quán** | Sử dụng cùng `max-w-6xl` hoặc `max-w-7xl` | Trộn các chiều rộng container khác nhau |

---

## Danh sách kiểm tra trước khi bàn giao

Trước khi bàn giao mã UI, hãy xác minh các mục này:

### Chất lượng Trực quan
- [ ] Không sử dụng emojis làm icon (dùng SVG thay thế)
- [ ] Tất cả icon từ bộ icon nhất quán (Heroicons/Lucide)
- [ ] Logo thương hiệu chính xác (đã xác minh từ Simple Icons)
- [ ] Trạng thái hover không gây lệch bố cục

### Tương tác
- [ ] Tất cả các yếu tố click được đều có `cursor-pointer`
- [ ] Trạng thái hover cung cấp phản hồi trực quan rõ ràng
- [ ] Chuyển đổi mượt mà (150-300ms)
- [ ] Trạng thái focus hiển thị rõ ràng cho điều hướng bàn phím

### Chế độ Sáng/Tối
- [ ] Văn bản chế độ sáng có đủ độ tương phản (tối thiểu 4.5:1)
- [ ] Yếu tố kính/trong suốt hiển thị rõ ở chế độ sáng
- [ ] Viền hiển thị rõ ở cả hai chế độ
- [ ] Kiểm tra cả hai chế độ trước khi bàn giao

### Bố cục
- [ ] Các yếu tố nổi có khoảng cách thích hợp từ các cạnh
- [ ] Không có nội dung bị ẩn sau các thanh điều hướng cố định
- [ ] Responsive ở 320px, 768px, 1024px, 1440px
- [ ] Không cuộn ngang trên mobile

### Khả năng truy cập (Accessibility)
- [ ] Tất cả hình ảnh đều có văn bản thay thế (alt text)
- [ ] Các input trong form có nhãn (label)
- [ ] Màu sắc không phải là chỉ báo duy nhất
- [ ] Tôn trọng `prefers-reduced-motion`
