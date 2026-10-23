import http from 'node:http';
import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {TaskStore} from './tasks.js';
export function createApp() {
 const store = new TaskStore();
 return http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const send = (status, value) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(value)); };
  try {
   if (req.method === 'GET' && path === '/') {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    return res.end(await readFile(new URL('./public/index.html', import.meta.url)));
   }
   if (req.method === 'GET' && path === '/api/tasks') return send(200, store.list());
   const match = path.match(/^\/api\/tasks\/(\d+)$/);
   if (req.method === 'POST' && path === '/api/tasks' || req.method === 'PATCH' && match) {
    let body = ''; for await (const chunk of req) { body += chunk; if (body.length > 10000) return send(413,{error:'資料太大'}); }
    let data; try { data = JSON.parse(body); } catch { return send(400,{error:'JSON 格式錯誤'}); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return send(400,{error:'資料格式錯誤'});
    if (req.method === 'POST') return send(201, store.add(data.title));
    const task = store.update(Number(match[1]), data.completed);
    return send(task ? 200 : 404, task || {error:'找不到任務'});
   }
   if (req.method === 'DELETE' && match) return store.remove(Number(match[1])) ? send(200,{success:true}) : send(404,{error:'找不到任務'});
   send(404,{error:'找不到路徑'});
  } catch (error) { send(400,{error:error.message}); }
 });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
 const port = Number(process.env.PORT || 3000);
 createApp().listen(port, '127.0.0.1', () => console.log(`Campus Tasks: http://localhost:${port}`));
}
