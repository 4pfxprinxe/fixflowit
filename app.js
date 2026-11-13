(() => {
"use strict";
const $ = id => document.getElementById(id);
const sidebar=$("sidebar"), overlay=$("menuOverlay"), menu=$("menuToggle");
function setMenu(open){sidebar?.classList.toggle("open",open);overlay?.classList.toggle("show",open);menu?.setAttribute("aria-expanded",String(open));}
menu?.addEventListener("click",()=>setMenu(!sidebar.classList.contains("open")));
overlay?.addEventListener("click",()=>setMenu(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
const themeKey="fixflowit-theme";
try{if(localStorage.getItem(themeKey)==="light")document.body.classList.add("light-mode");}catch{}
$("themeToggle")?.addEventListener("click",()=>{document.body.classList.toggle("light-mode");try{localStorage.setItem(themeKey,document.body.classList.contains("light-mode")?"light":"dark");}catch{}});
$("resetChecklist")?.addEventListener("click",()=>document.querySelectorAll(".step-check").forEach(el=>el.checked=false));
$("calcForm")?.addEventListener("submit",e=>{
e.preventDefault();
const devices=Number($("devices").value),minutes=Number($("minutesPer").value),rateInput=$("hourlyRate").value.trim(),rate=Number(rateInput),result=$("calcResult");
if(!Number.isSafeInteger(devices)||devices<=0||!Number.isFinite(minutes)||minutes<=0|| (rateInput!==""&&(!Number.isFinite(rate)||rate<0))){result.textContent="Please enter a positive whole number of devices, positive minutes, and a valid nonnegative hourly rate.";return;}
const total=devices*minutes,hours=total/60;
if(!Number.isFinite(total)||!Number.isFinite(hours)){result.textContent="Estimate is too large. Please use smaller values.";return;}
let msg=`Total time: ${total.toFixed(1)} minutes (${hours.toFixed(2)} hours).`;
if(rateInput!==""){const cost=hours*rate;msg+=Number.isFinite(cost)?` Estimated labor cost: $${cost.toFixed(2)}.`:" Labor cost is too large to calculate.";}
msg+=hours<=1?" This is a quick job.":hours<=4?" Plan for a short repair window.":" This may require extended downtime.";
result.textContent=msg;
});
const form=$("fixForm"),tbody=$("historyBody"),empty=$("noRecordsMsg"),feedback=$("fixFeedback"),storageKey="fixLogEntries";
if(form&&tbody){
let entries=[];
try{const stored=JSON.parse(localStorage.getItem(storageKey)||"[]");entries=Array.isArray(stored)?stored.filter(x=>x&&typeof x==="object"):[];}catch{feedback.textContent="Previous repair history could not be loaded.";}
function render(){tbody.replaceChildren();for(const entry of entries){const tr=document.createElement("tr");for(const field of ["equipment","problem","solution","dateFixed","technician"]){const td=document.createElement("td");td.textContent=String(entry[field]??"");tr.appendChild(td);}tbody.appendChild(tr);}empty.hidden=entries.length>0;}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(entries));return true;}catch{feedback.textContent="Unable to save. Check browser storage settings or available space.";return false;}}
render();
if($("dateFixed"))$("dateFixed").value=new Date().toLocaleDateString("en-CA");
form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const entry={};for(const field of ["equipment","problem","solution","dateFixed","technician"])entry[field]=$(field).value.trim();if(Object.values(entry).some(v=>!v)){feedback.textContent="Complete all fields before saving.";return;}entries.unshift(entry);if(!persist()){entries.shift();return;}render();form.reset();feedback.textContent="Repair saved successfully.";});
$("clearLogBtn")?.addEventListener("click",()=>{if(!entries.length)return;if(!confirm("Delete all saved repair records from this browser? This cannot be undone."))return;const previous=entries;entries=[];if(!persist()){entries=previous;return;}render();feedback.textContent="Repair history cleared.";});
}
})();
