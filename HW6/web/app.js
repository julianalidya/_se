let tasks = [], filter = 'all';
const $ = id => document.getElementById(id);
async function api(path, options = {}) {
  const res = await fetch('/api/' + path, { ...options, headers: {'Content-Type': 'application/json'} });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '操作失敗');
  return data;
}
function render() {
  $('total').textContent = tasks.length;
  $('done').textContent = tasks.filter(t => t.done).length;
  $('pending').textContent = tasks.filter(t => !t.done).length;
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  $('tasks').replaceChildren();
  if (!visible.length) {
    const empty = document.createElement('p'); empty.className = 'empty';
    empty.textContent = '這裡還沒有任務。為自己新增一個小目標吧！'; $('tasks').append(empty);
  }
  visible.forEach(t => {
    const row = document.createElement('div'); row.className = 'task' + (t.done ? ' completed' : '');
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = t.done;
    check.setAttribute('aria-label', '完成任務：' + t.title);
    check.onchange = async () => { check.disabled = true; try { await api('tasks/' + t.id, {method:'PATCH', body:JSON.stringify({done:check.checked})}); await load(); } catch(e) { check.checked = t.done; $('message').textContent = e.message; } finally { check.disabled = false; } };
    const content = document.createElement('div'); content.className = 'task-text';
    const title = document.createElement('strong'); title.textContent = t.title;
    const course = document.createElement('small'); course.textContent = t.course || '未分類課程'; content.append(title, course);
    const del = document.createElement('button'); del.className = 'delete'; del.textContent = '刪除'; del.setAttribute('aria-label', '刪除任務：' + t.title);
    del.onclick = async () => { if (!confirm('確定刪除這個任務？')) return; del.disabled = true; try { await api('tasks/' + t.id, {method:'DELETE'}); await load(); } catch(e) { $('message').textContent = e.message; del.disabled = false; } };
    row.append(check, content, del); $('tasks').append(row);
  });
}
async function load() { tasks = await api('tasks'); render(); $('message').textContent = ''; }
$('task-form').onsubmit = async e => {
  e.preventDefault(); $('add').disabled = true;
  try { await api('tasks', {method:'POST', body:JSON.stringify({title:$('title').value, course:$('course').value})}); $('task-form').reset(); await load(); }
  catch(e) { $('message').textContent = e.message; }
  finally { $('add').disabled = false; }
};
document.querySelectorAll('[data-filter]').forEach(btn => btn.onclick = () => {
  filter = btn.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn)); render();
});
async function start() {
  try { await api('health'); $('health').textContent = '● 系統與資料庫已連線'; await load(); }
  catch(e) { $('health').textContent = '● 連線失敗'; $('message').textContent = e.message + '；請確認 Docker 已啟動，然後重新整理。'; }
}
start();
