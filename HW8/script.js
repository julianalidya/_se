const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const key="unimate-hw3";
const seed=()=>({tasks:[
{id:1,title:"Software Engineering HW3",date:datePlus(2),category:"University",done:false},
{id:2,title:"AWS cloud practice",date:datePlus(4),category:"University",done:false},
{id:3,title:"Solve 3 LeetCode problems",date:datePlus(1),category:"University",done:true}
],expenses:[{id:1,name:"Lunch",amount:120,category:"Food"},{id:2,name:"Bus",amount:30,category:"Transport"},{id:3,name:"Coffee",amount:65,category:"Food"}],study:0,studyDate:datePlus(0),note:"",notes:""});
function datePlus(n){let d=new Date();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function validData(d){return d && Array.isArray(d.tasks) && d.tasks.every(t=>Number.isSafeInteger(t.id)&&typeof t.title==="string"&&typeof t.category==="string"&&typeof t.done==="boolean"&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&Number.isFinite(Date.parse(t.date))) && Array.isArray(d.expenses) && d.expenses.every(e=>Number.isSafeInteger(e.id)&&typeof e.name==="string"&&typeof e.category==="string"&&Number.isFinite(e.amount)&&e.amount>0) && Number.isFinite(d.study)&&d.study>=0 && typeof d.note==="string"&&typeof d.notes==="string"}
let data;try{data=JSON.parse(localStorage.getItem(key)||"null");if(!validData(data))data=seed()}catch{data=seed()}
function persist(){try{localStorage.setItem(key,JSON.stringify(data))}catch{alert("Unable to save data. Download a backup and check browser storage.")}}
const save=()=>{persist();render()};
function pretty(d){return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
 if(data.studyDate!==datePlus(0)){data.study=0;data.studyDate=datePlus(0);persist()}
 const open=data.tasks.filter(t=>!t.done); $("#taskCount").textContent=open.length;
 const now=new Date(); now.setHours(0,0,0,0);
 $("#dueCount").textContent=open.filter(t=>{let x=new Date(t.date+"T00:00:00");return (x-now)/86400000<=3}).length;
 $("#studyMinutes").textContent=data.study;
 $("#expenseTotal").textContent=data.expenses.reduce((a,b)=>a+Number(b.amount),0).toLocaleString();
 const taskHTML=t=>`<div class="item ${t.done?"done":""}"><input class="check" type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"><div class="item-main"><div class="item-title">${esc(t.title)}</div><div class="meta">${pretty(t.date)} · ${esc(t.category)}</div></div><span class="tag">${esc(t.category)}</span><button class="small-btn" onclick="editTask(${t.id})">Edit</button><button aria-label="Delete task" class="delete" onclick="deleteTask(${t.id})">×</button></div>`;
 const search=$("#taskSearch").value.toLowerCase(), filter=$("#taskFilter").value;
 const shown=data.tasks.filter(t=>t.title.toLowerCase().includes(search)&&(filter==="all"||filter==="open"&&!t.done||filter==="done"&&t.done||filter==="overdue"&&!t.done&&t.date<datePlus(0))).sort((a,b)=>Number(a.done)-Number(b.done)||a.date.localeCompare(b.date));
 $("#taskList").innerHTML=shown.length?shown.map(taskHTML).join(""):`<div class="empty">No tasks yet. Add your first one above.</div>`;
 $("#taskPreview").innerHTML=open.length?open.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4).map(taskHTML).join(""):`<div class="empty">Nothing on your list 🎉</div>`;
 const expHTML=e=>`<div class="item"><div class="item-main"><div class="item-title">${esc(e.name)}</div><div class="meta">${esc(e.category)}</div></div><strong>NT$ ${Number(e.amount).toLocaleString()}</strong><button class="delete" onclick="deleteExpense(${e.id})">×</button></div>`;
 $("#expenseList").innerHTML=data.expenses.length?data.expenses.map(expHTML).join(""):`<div class="empty">No expenses recorded.</div>`;
 $("#expensePreview").innerHTML=data.expenses.length?data.expenses.slice(-3).reverse().map(expHTML).join(""):`<div class="empty">No expenses yet.</div>`;
 $("#quickNote").value=data.note||""; $("#notesArea").value=data.notes||"";
}
window.toggleTask=id=>{let t=data.tasks.find(x=>x.id===id);if(t)t.done=!t.done;save()}
window.deleteTask=id=>{data.tasks=data.tasks.filter(x=>x.id!==id);save()}
window.deleteExpense=id=>{data.expenses=data.expenses.filter(x=>x.id!==id);save()}
$("#taskForm").addEventListener("submit",e=>{e.preventDefault();if(!$("#taskInput").value.trim())return;data.tasks.unshift({id:Date.now(),title:$("#taskInput").value.trim(),date:$("#taskDate").value,category:$("#taskCategory").value,done:false});e.target.reset();$("#taskDate").value=datePlus(1);save()})
$("#expenseForm").addEventListener("submit",e=>{e.preventDefault();if(!$("#expenseName").value.trim()||!Number.isFinite(+$("#expenseAmount").value)||+$("#expenseAmount").value<=0)return;data.expenses.push({id:Date.now(),name:$("#expenseName").value.trim(),amount:+$("#expenseAmount").value,category:$("#expenseCategory").value});e.target.reset();save()})
$("#saveNote").onclick=()=>{data.note=$("#quickNote").value;persist();$("#noteStatus").textContent="Saved ✓";setTimeout(()=>$("#noteStatus").textContent="Saved automatically",1400)}
$("#saveNotesArea").onclick=()=>{data.notes=$("#notesArea").value;persist();$("#saveNotesArea").textContent="Saved ✓";setTimeout(()=>$("#saveNotesArea").textContent="Save notes",1200)}
$("#quickNote").addEventListener("input",()=>{data.note=$("#quickNote").value;persist()})
$("#resetBtn").onclick=()=>{if(confirm("Reset all UniMate data to the demo version?")){data=seed();persist();seconds=1500;running=false;clearInterval(interval);syncTimer();render()}}
window.showSection=id=>{$$(".section").forEach(x=>x.classList.add("hidden"));$("#"+id).classList.remove("hidden");$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.target===id));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav").forEach(n=>n.onclick=()=>showSection(n.dataset.target));
let seconds=1500,running=false,interval,endsAt=0;
function syncTimer(){let s=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;$("#timer").textContent=s;$("#timerLarge").textContent=s;$("#timerBtn").textContent=$("#timerBtnLarge").textContent=running?"Pause":"Start focus"}
function toggleTimer(){running=!running;if(running){endsAt=Date.now()+seconds*1000;interval=setInterval(()=>{seconds=Math.max(0,Math.ceil((endsAt-Date.now())/1000));syncTimer();if(seconds<=0){clearInterval(interval);running=false;seconds=1500;if(data.studyDate!==datePlus(0)){data.study=0;data.studyDate=datePlus(0)}data.study+=25;save();syncTimer();alert("Focus session complete! 25 minutes added to your study time.");}},1000)}else clearInterval(interval);syncTimer()}
function resetTimer(){clearInterval(interval);running=false;seconds=1500;syncTimer()}
$("#timerBtn").onclick=$("#timerBtnLarge").onclick=toggleTimer;$("#timerReset").onclick=$("#timerResetLarge").onclick=resetTimer;
let d=new Date();$("#today").textContent=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();let h=d.getHours();$("#daypart").textContent=h<12?"morning":h<18?"afternoon":"evening";$("#taskDate").value=datePlus(1);render();syncTimer();
window.editTask=id=>{const t=data.tasks.find(t=>t.id===id);if(!t)return;const title=prompt("Task name",t.title);if(title===null||!title.trim())return;const date=prompt("Deadline (YYYY-MM-DD)",t.date);if(date===null)return;if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))){alert("Please enter a valid date.");return}t.title=title.trim();t.date=date;save()};
$("#taskSearch").oninput=render;$("#taskFilter").onchange=render;
$("#notesArea").oninput=()=>{data.notes=$("#notesArea").value;persist()};
$("#exportBtn").onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="UniMate-backup-"+datePlus(0)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$("#importFile").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2000000)throw Error();const imported=JSON.parse(await file.text());if(!validData(imported))throw Error();if(confirm("Replace current data with this backup? Download a backup first if needed.")){resetTimer();data=imported;save()}}catch{alert("Invalid backup. Choose a UniMate JSON backup smaller than 2 MB.")}finally{e.target.value=""}};
setInterval(()=>{if(data.studyDate!==datePlus(0))render()},60000);
