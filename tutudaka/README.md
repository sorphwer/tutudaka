# Tutudaka - 习惯打卡日历

移动端优先的习惯打卡日历，用四角彩色圆点记录早起/早睡/点外卖/出去吃。

## 本地开发

1. 复制环境变量模板
   ```bash
   cp .env.example .env.local
   ```
2. 设置 `.env.local`
   - `PASSWORD` 必填
   - `BLOB_READ_WRITE_TOKEN` 本地可留空（会写入 `.local-data.json`）
3. 启动开发服务器
   ```bash
   npm install
   npm run dev
   ```

打开 `http://localhost:3000` 查看。

## 本地数据说明

未配置 `BLOB_READ_WRITE_TOKEN` 时，开发环境会把数据写到项目根目录的 `.local-data.json`。该文件已加入 `.gitignore`，不会提交到仓库。

## 部署到 Vercel

在 Vercel 项目环境变量中设置：

- `PASSWORD`
- `BLOB_READ_WRITE_TOKEN`

部署后数据会持久化到 Vercel Blob Storage。

## API

- `POST /api/auth`：验证密码并写入 Cookie
- `GET /api/auth/check`：检查登录状态
- `GET /api/records`：获取所有打卡记录
- `POST /api/records`：更新指定日期的任务状态
