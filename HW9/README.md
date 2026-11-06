# HW9：將 UniMate 網站部署至 Cloudflare

- **學號：** 111210552
- **姓名：** 林小蓮
- **班級：** 資工四

## 線上網站

[開啟 UniMate](https://unimate.juliana-lidya1.workers.dev/)

## 作業說明

本次作業延續 HW8 的 UniMate 學生生活管理網站，透過 Cloudflare Workers 的靜態檔案上傳功能完成部署，讓使用者可以透過 HTTPS 網址開啟網站。

## 網站功能

- Dashboard：顯示待完成任務、近期到期任務、當日專注時間與支出總額。
- Tasks：新增、編輯、完成及刪除任務，並依狀態篩選。
- Focus：使用 25 分鐘番茄鐘安排專注時間。
- Expenses：新增與刪除支出，查看支出紀錄。
- Notes：儲存筆記。
- Backup：匯出與還原備份。

資料透過瀏覽器的 localStorage 儲存在目前的裝置與瀏覽器中，不會自動跨裝置同步。

## 使用技術

HTML、CSS、JavaScript、localStorage、Cloudflare Workers Static Assets。

## 檔案結構

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 網站結構 |
| `style.css` | 版面與樣式 |
| `script.js` | 網站互動與資料儲存 |
| `README.md` | 作業說明與部署網址 |

## 部署流程

1. 登入 Cloudflare，進入 Workers & Pages。
2. 點選 Create application，再選擇 Upload your static files。
3. 上傳 `index.html`、`style.css` 與 `script.js`。
4. 點選 Deploy 完成部署。
5. 將應用程式名稱設定為 `unimate`。
6. 開啟部署網址，確認 UniMate Dashboard 與樣式正常顯示。

## 部署結果

網站已部署至 Cloudflare，並在瀏覽器中成功顯示 Dashboard。

**網址：** https://unimate.juliana-lidya1.workers.dev/
