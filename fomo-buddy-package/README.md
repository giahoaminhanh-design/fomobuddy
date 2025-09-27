# FoMO Buddy – Full Package
Gồm 2 phần:
- `proxy/` (Vercel Edge) – giấu API key, tạo endpoint `/api/chat`
- `web-widget/` – nút chat nổi nhúng vào website

## 1) Triển khai Proxy trên Vercel
- Xem `proxy/README.md`

## 2) Nhúng chat vào website
- Copy `web-widget/fomo-chat.css` và `web-widget/fomo-chat.js` vào web
- Thêm đoạn cấu hình như `snippet.html` (đổi `proxy:` sang URL Vercel của bạn)

## Gợi ý bảo mật
- Cập nhật `ALLOWED_ORIGINS` trong `proxy/api/chat.js` đúng domain của bạn.
- Không đưa API key vào frontend.
