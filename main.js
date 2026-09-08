const PLAN_INFO={
 ONE:{label:"One Time",price:"₦2,500",ms:0},
 WEEK:{label:"Weekly",price:"₦9,000",ms:7*86400000},
 MONTH:{label:"Monthly",price:"₦29,000",ms:30*86400000},
 YEAR:{label:"Yearly",price:"₦145,000",ms:365*86400000}
};
const PRODUCTS=[
{id:"WA-LINK",icon:"↗",title:"WhatsApp Link Assistant",desc:"Guided device-linking and connection troubleshooting for accounts you own.",features:["Pairing checklist","Connection diagnostics","Official-help guidance"]},
{id:"WA-SHIELD",icon:"◈",title:"WhatsApp Safety Center",desc:"A security workspace for improving privacy, recovery and account protection.",features:["Security audit","Privacy checklist","Recovery planner"]},
{id:"WA-BACKUP",icon:"▣",title:"WhatsApp Backup Desk",desc:"Organize backup, restore and chat-export preparation for your own account.",features:["Backup checklist","Restore planner","Export notes"]},
{id:"WA-BIZ",icon:"◇",title:"WhatsApp Business Desk",desc:"A professional workspace for legitimate business messaging operations.",features:["Business profile","Quick replies","Catalog checklist"]},
{id:"TG-BOT",icon:"✦",title:"Telegram Bot Suite",desc:"Coming soon — a toolkit for configuring and managing your own Telegram bot.",features:["Bot planning","Command checklist","Coming soon"]}
];
let selectedProduct="WA-LINK",selectedPlan="ONE",timerHandle=null;

const $=id=>document.getElementById(id);
function scrollTo(id){$(id).scrollIntoView({behavior:"smooth"})}
document.querySelectorAll("[data-scroll]").forEach(b=>b.onclick=()=>scrollTo(b.dataset.scroll));

function renderProducts(){
 $("productGrid").innerHTML=PRODUCTS.map(p=>`<article class="product ${p.id===selectedProduct?"active":""}">
 <div class="picon">${p.icon}</div><h3>${p.title}</h3><p>${p.desc}</p>
 <ul>${p.features.map(x=>`<li>${x}</li>`).join("")}</ul>
 <button class="dark-btn" onclick="chooseProduct('${p.id}')">Select Tool</button></article>`).join("");
}
function renderPrices(){
 $("priceGrid").innerHTML=Object.entries(PLAN_INFO).map(([id,p])=>`<div class="price">
 <div class="eyebrow">${p.label.toUpperCase()}</div><strong>${p.price}</strong>
 <span>${id==="ONE"?"One-use access":id==="WEEK"?"7-day access":id==="MONTH"?"30-day access":"365-day access"}</span>
 </div>`).join("");
}
function chooseProduct(id){selectedProduct=id;renderProducts();openPurchase()}
function openPurchase(){ $("purchaseModal").classList.add("show");renderModalPlans(); }
function closePurchase(){ $("purchaseModal").classList.remove("show") }
function renderModalPlans(){
 $("modalPlans").innerHTML=Object.entries(PLAN_INFO).map(([id,p])=>`<button class="modal-plan ${id===selectedPlan?"active":""}" onclick="selectPlan('${id}')">${p.label}<b>${p.price}</b></button>`).join("");
}
function selectPlan(id){selectedPlan=id;renderModalPlans()}

$("buyBtn").onclick=openPurchase;
$("closeModal").onclick=closePurchase;
$("paidWait").onclick=()=>window.open("https://t.me/dannyisnowdylan","_blank","noopener");

function findKey(key){
 for(const [group,list] of Object.entries(ACCESS_KEYS||{})){
   if(list.includes(key)) return group.split("|");
 }
 return null;
}
function redeem(){
 const key=$("keyInput").value.trim().toUpperCase();
 const found=findKey(key);
 if(!found){$("accessMessage").textContent="Invalid access key.";return}
 const [product,plan]=found;
 const usedKey="danny_used_"+key;
 if(plan==="ONE" && localStorage.getItem(usedKey)){$("accessMessage").textContent="This one-time key has already been used.";return}
 if(plan==="ONE")localStorage.setItem(usedKey,"1");
 const duration=PLAN_INFO[plan].ms;
 const session={product,plan,expiry:duration?Date.now()+duration:null};
 localStorage.setItem("danny_session",JSON.stringify(session));
 $("accessMessage").textContent="Access granted.";
 showDashboard(session);
}
$("unlockBtn").onclick=redeem;
$("keyInput").addEventListener("keydown",e=>{if(e.key==="Enter")redeem()});

function showDashboard(s){
 const p=PRODUCTS.find(x=>x.id===s.product);
 $("dashboard").classList.remove("hidden");
 $("dashProduct").textContent=p.title;
 $("dashPlan").textContent=PLAN_INFO[s.plan].label;
 $("expiryText")?.remove();
 $("toolWorkspace").innerHTML=`
 <article class="work-card"><div class="eyebrow">01 • CHECKLIST</div><h3>Setup Guide</h3><p>Follow a step-by-step checklist for your selected utility. Use only with accounts or services you are authorized to manage.</p><button class="gold-btn" onclick="toast('Checklist opened')">Open Guide</button></article>
 <article class="work-card"><div class="eyebrow">02 • NOTES</div><h3>Case Notes</h3><p>Keep private notes for your own support or moderation workflow.</p><textarea placeholder="Write notes here..."></textarea></article>
 <article class="work-card"><div class="eyebrow">03 • SUPPORT</div><h3>Owner Support</h3><p>Need help with your purchased access? Contact the owner directly on Telegram.</p><a class="gold-btn" href="https://t.me/dannyisnowdylan" target="_blank">Contact Owner</a></article>
 <article class="work-card"><div class="eyebrow">04 • UPDATES</div><h3>Telegram Updates</h3><p>Get announcements, releases and future product information.</p><a class="dark-btn" href="https://t.me/dannys_domainn" target="_blank">Channel</a></article>
 <article class="work-card"><div class="eyebrow">05 • COMING SOON</div><h3>Telegram Bot Suite</h3><p>New automation and bot-management utilities are being prepared.</p><button class="dark-btn" onclick="toast('Coming soon')">Coming Soon</button></article>`;
 scrollTo("dashboard");updateTimer();clearInterval(timerHandle);timerHandle=setInterval(updateTimer,1000);
}
function updateTimer(){
 const s=JSON.parse(localStorage.getItem("danny_session")||"null");if(!s)return;
 if(!s.expiry){$("timer").textContent="ONE USE";return}
 const left=s.expiry-Date.now();
 if(left<=0){logout();toast("Access expired — logged out.");return}
 let sec=Math.floor(left/1000),d=Math.floor(sec/86400);sec%=86400;
 let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);sec%=60;
 $("timer").textContent=`${d}d ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}
function logout(){localStorage.removeItem("danny_session");$("dashboard").classList.add("hidden");clearInterval(timerHandle);scrollTo("access")}
$("logoutBtn").onclick=logout;
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2500)}

function restore(){const s=JSON.parse(localStorage.getItem("danny_session")||"null");if(s&&(!s.expiry||s.expiry>Date.now()))showDashboard(s);else localStorage.removeItem("danny_session")}
renderProducts();renderPrices();restore();
