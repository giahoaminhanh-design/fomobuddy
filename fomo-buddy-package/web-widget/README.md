# FoMO Buddy – Web Widget
Nút chat nổi + panel, gọi tới proxy Vercel để nhận phản hồi AI.

## Dùng nhanh
1) Upload 2 file sau vào website của bạn:
   - `web-widget/fomo-chat.css`
   - `web-widget/fomo-chat.js`
2) Thêm vào `<head>`:
   ```html
   <link rel="stylesheet" href="fomo-chat.css">
   <script>
     window.FOMO_CHAT = {
       proxy: 'https://<YOUR-PROJECT>.vercel.app/api/chat', // đổi thành endpoint Vercel của bạn
       title: 'FoMO Buddy'
     };
   </script>
   <script src="fomo-chat.js" defer></script>
   ```

Sau đó build/commit → web sẽ xuất hiện nút **“💬 Chat FoMO”** ở góc phải dưới.
