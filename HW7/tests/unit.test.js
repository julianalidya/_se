import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TaskStore} from '../tasks.js';
test('新增任務會去除空白並設定未完成',()=>{const s=new TaskStore();assert.deepEqual(s.add('  HW7  '),{id:1,title:'HW7',completed:false});});
test('拒絕空白、錯誤型別及過長名稱',()=>{for(const title of ['', '   ', null, 123, 'a'.repeat(101)])assert.throws(()=>new TaskStore().add(title));});
test('完成與取消完成任務',()=>{const s=new TaskStore();s.add('A');assert.equal(s.update(1,true).completed,true);assert.equal(s.update(1,false).completed,false);assert.throws(()=>s.update(1,'true'));assert.equal(s.update(99,true),null);});
test('刪除任務不會影響其他任務',()=>{const s=new TaskStore();s.add('A');s.add('B');assert.equal(s.remove(1),true);assert.deepEqual(s.list().map(t=>t.title),['B']);assert.equal(s.remove(1),false);});
test('讀取資料不會直接暴露內部物件',()=>{const s=new TaskStore();s.add('A');s.list()[0].title='Changed';assert.equal(s.list()[0].title,'A');});
