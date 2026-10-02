const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const key="unimate-hw3";
const seed=()=>({tasks:[
{id:1,title:"Software Engineering HW3",date:datePlus(2),category:"University",done:false},
{id:2,title:"AWS cloud practice",date:datePlus(4),category:"University",done:false},
{id:3,title:"Solve 3 LeetCode problems",date:datePlus(1),category:"University",done:true}
],expenses:[{id:1,name:"Lunch",amount:120,category:"Food"},{id:2,name:"Bus",amount:30,category:"Transport"},{id:3,name:"Coffee",amount:65,category:"Food"}],study:0,note:"",notes:""});
function datePlus(n){let d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
let data=JSON.parse(localStorage.getItem(key)||"null")||seed();
const save=()=>{localStorage.setItem(key,JSON.stringify(data));render()};
function pretty(d){return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
 const open=data.tasks.filter(t=>!t.done); $("#taskCount").textContent=open.length;
 const now=new Date(); now.setHours(0,0,0,0);
 $("#dueCount").textContent=open.filter(t=>{let x=new Date(t.date+"T00:00:00");return (x-now)/86400000<=3}).length;
 $("#studyMinutes").textContent=data.study;
 $("#expenseTotal").textContent=data.expenses.reduce((a,b)=>a+Number(b.amount),0).toLocaleString();
 const taskHTML=t=>`<div class="item ${t.done?"done":""}"><input class="check" type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"><div class="item-main"><div class="item-title">${esc(t.title)}</div><div class="meta">${pretty(t.date)} · ${esc(t.category)}</div></div><span class="tag">${esc(t.category)}</span><button class="delete" onclick="deleteTask(${t.id})">×</button></div>`;
 $("#taskList").innerHTML=data.tasks.length?data.tasks.map(taskHTML).join(""):`<div class="empty">No tasks yet. Add your first one above.</div>`;
 $("#taskPreview").innerHTML=data.tasks.length?data.tasks.slice(0,4).map(taskHTML).join(""):`<div class="empty">Nothing on your list 🎉</div>`;
 const expHTML=e=>`<div class="item"><div class="item-main"><div class="item-title">${esc(e.name)}</div><div class="meta">${esc(e.category)}</div></div><strong>NT$ ${Number(e.amount).toLocaleString()}</strong><button class="delete" onclick="deleteExpense(${e.id})">×</button></div>`;
 $("#expenseList").innerHTML=data.expenses.length?data.expenses.map(expHTML).join(""):`<div class="empty">No expenses recorded.</div>`;
 $("#expensePreview").innerHTML=data.expenses.length?data.expenses.slice(-3).reverse().map(expHTML).join(""):`<div class="empty">No expenses yet.</div>`;
 $("#quickNote").value=data.note||""; $("#notesArea").value=data.notes||"";
}
window.toggleTask=id=>{let t=data.tasks.find(x=>x.id===id);if(t)t.done=!t.done;save()}
window.deleteTask=id=>{data.tasks=data.tasks.filter(x=>x.id!==id);save()}
window.deleteExpense=id=>{data.expenses=data.expenses.filter(x=>x.id!==id);save()}
$("#taskForm").addEventListener("submit",e=>{e.preventDefault();data.tasks.unshift({id:Date.now(),title:$("#taskInput").value.trim(),date:$("#taskDate").value,category:$("#taskCategory").value,done:false});e.target.reset();$("#taskDate").value=datePlus(1);save()})
$("#expenseForm").addEventListener("submit",e=>{e.preventDefault();data.expenses.push({id:Date.now(),name:$("#expenseName").value.trim(),amount:+$("#expenseAmount").value,category:$("#expenseCategory").value});e.target.reset();save()})
$("#saveNote").onclick=()=>{data.note=$("#quickNote").value;localStorage.setItem(key,JSON.stringify(data));$("#noteStatus").textContent="Saved ✓";setTimeout(()=>$("#noteStatus").textContent="Saved automatically",1400)}
$("#saveNotesArea").onclick=()=>{data.notes=$("#notesArea").value;localStorage.setItem(key,JSON.stringify(data));$("#saveNotesArea").textContent="Saved ✓";setTimeout(()=>$("#saveNotesArea").textContent="Save notes",1200)}
$("#quickNote").addEventListener("input",()=>{data.note=$("#quickNote").value;localStorage.setItem(key,JSON.stringify(data))})
$("#resetBtn").onclick=()=>{if(confirm("Reset all UniMate data to the demo version?")){data=seed();localStorage.setItem(key,JSON.stringify(data));seconds=1500;running=false;clearInterval(interval);syncTimer();render()}}
window.showSection=id=>{$$(".section").forEach(x=>x.classList.add("hidden"));$("#"+id).classList.remove("hidden");$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.target===id));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav").forEach(n=>n.onclick=()=>showSection(n.dataset.target));
let seconds=1500,running=false,interval;
function syncTimer(){let s=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;$("#timer").textContent=s;$("#timerLarge").textContent=s;$("#timerBtn").textContent=$("#timerBtnLarge").textContent=running?"Pause":"Start focus"}
function toggleTimer(){running=!running;if(running){interval=setInterval(()=>{seconds--;syncTimer();if(seconds<=0){clearInterval(interval);running=false;seconds=1500;data.study+=25;save();syncTimer();alert("Focus session complete! 25 minutes added to your study time.");}},1000)}else clearInterval(interval);syncTimer()}
function resetTimer(){clearInterval(interval);running=false;seconds=1500;syncTimer()}
$("#timerBtn").onclick=$("#timerBtnLarge").onclick=toggleTimer;$("#timerReset").onclick=$("#timerResetLarge").onclick=resetTimer;
let d=new Date();$("#today").textContent=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();let h=d.getHours();$("#daypart").textContent=h<12?"morning":h<18?"afternoon":"evening";$("#taskDate").value=datePlus(1);render();syncTimer();