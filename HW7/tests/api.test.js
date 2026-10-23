import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.js';
let server,base;
before(async()=>{server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(r=>server.close(r)));
const request=(path,method='GET',body)=>fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
test('Web API 完整生命週期：新增、列表、完成、刪除',async()=>{
 let r=await request('/api/tasks','POST',{title:'API homework'});assert.equal(r.status,201);const task=await r.json();
 r=await request('/api/tasks');assert.equal(r.status,200);assert.ok((await r.json()).some(t=>t.id===task.id));
 r=await request('/api/tasks/'+task.id,'PATCH',{completed:true});assert.equal(r.status,200);assert.equal((await r.json()).completed,true);
 r=await request('/api/tasks/'+task.id,'DELETE');assert.equal(r.status,200);
 r=await request('/api/tasks');assert.equal((await r.json()).some(t=>t.id===task.id),false);
});
test('API 拒絕無效輸入與 JSON',async()=>{for(const body of [{title:' '},null,{title:'a'.repeat(101)}])assert.equal((await request('/api/tasks','POST',body)).status,400);const r=await fetch(base+'/api/tasks',{method:'POST',body:'{bad'});assert.equal(r.status,400);});
test('不存在的任務與路徑回傳 404',async()=>{assert.equal((await request('/api/tasks/999','DELETE')).status,404);assert.equal((await request('/missing')).status,404);});
test('首頁提供 HTML',async()=>{const r=await request('/');assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/html/);assert.match(await r.text(),/Campus Tasks/);});
