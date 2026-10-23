export class TaskStore {
  constructor() { this.tasks = []; this.nextId = 1; }
  list() { return this.tasks.map(t => ({...t})); }
  add(title) {
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) throw new Error('請輸入 1–100 字的任務名稱');
    const task = {id: this.nextId++, title: title.trim(), completed: false};
    this.tasks.push(task); return {...task};
  }
  update(id, completed) {
    if (typeof completed !== 'boolean') throw new Error('completed 必須是布林值');
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.completed = completed; return {...task};
  }
  remove(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index < 0) return false;
    this.tasks.splice(index, 1); return true;
  }
}
