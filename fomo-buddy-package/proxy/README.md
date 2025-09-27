# FoMO Buddy – Vercel Proxy (Edge)
Proxy bảo vệ API key OpenAI. Dùng cùng widget web.

## Triển khai
1) Push thư mục `proxy/` lên GitHub.
2) Vào https://vercel.com → **New Project** → Import repo.
3) Trong Project → **Settings → Environment Variables**:
   - `OPENAI_API_KEY` = <API key của bạn>
4) Deploy. Endpoint sẽ là: `https://<project-name>.vercel.app/api/chat`

## Cấu hình CORS
Trong `api/chat.js`, cập nhật mảng `ALLOWED_ORIGINS` thành domain của bạn (không nên để `*` khi chạy thật).
