(() => {
'use strict';
const C = window.WEDDING;
const $ = id => document.getElementById(id);
const text = (id, value) => { const el=$(id); if(el)el.textContent=value; };
const safeLink = str => { try {const u = new URL(str); return u.protocol === 'https:' ? u.href : ''; } catch {return '';} };
const param = new URLSearchParams(location.search);
const invitee = (param.get('to') || '').slice(0,120).trim();
if (invitee) text('guest-name',invitee);
$('open-invitation').addEventListener('click', () => { $('cover').classList.add('opened'); setTimeout(()=>{ $('cover').hidden=true; },1250); document.body.style.overflow=''; });
document.body.style.overflow='hidden';
text('bride-name', C.fullBride);text('groom-name',C.fullGroom);text('ceremony-time',C.ceremonyTime);text('reception-time',C.receptionTime);text('bride-parents',C.brideParents);text('groom-parents',C.groomParents);text('venue-name',C.venueName);text('venue-address',C.venueAddress);
const link=safeLink(C.mapsUrl); if(link){$('maps-link').href=link;$('maps-link').removeAttribute('aria-disabled');$('venue-warning').hidden=true;}
else {$('maps-link').addEventListener('click',e=>e.preventDefault());}
const googleCal=new URL('https://calendar.google.com/calendar/render');
googleCal.searchParams.set('action','TEMPLATE');googleCal.searchParams.set('text',`Pernikahan ${C.bride} & ${C.groom}`);
googleCal.searchParams.set('dates',`${C.calendarStart}/${C.calendarEnd}`);
googleCal.searchParams.set('details',C.description);googleCal.searchParams.set('location',`${C.venueName}, ${C.venueAddress}`);googleCal.searchParams.set('ctz',C.timezone);$('calendar-link').href=googleCal.toString();
const target = Date.parse(C.dateISO);
function updateCountdown(){const remain=Math.max(0,target-Date.now());let s=Math.floor(remain/1000);for(const [id,div] of [['days',86400],['hours',3600],['minutes',60],['seconds',1]]){text(id,String(Math.floor(s/div)).padStart(2,'0'));s%=div;}if(remain===0)text('countdown-note','Hari yang dinantikan telah tiba ♡');}
updateCountdown();setInterval(updateCountdown,1000);
const attendance=$('attendance'), guests=$('guests');
attendance.addEventListener('change',()=>{if(attendance.value==='Tidak Hadir'){guests.value='1';guests.disabled=true;}else guests.disabled=false;});
function renderWishes(items){const root=$('wishes-list');root.replaceChildren();if(!items.length){const p=document.createElement('p');p.className='empty-wishes';p.textContent='Belum ada ucapan. Jadilah yang pertama menyampaikan doa.';root.append(p);return;}items.forEach(item=>{const el=document.createElement('article');el.className='wish';const name=document.createElement('div');name.className='wish-name';name.textContent=String(item.name||'Tamu');const message=document.createElement('p');message.className='wish-message';message.textContent='“'+String(item.message||'')+'”';const time=document.createElement('small');time.className='wish-time';time.textContent=String(item.date||'');el.append(name,message,time);root.append(el);});}
let requestId=0;
function loadWishes(){const endpoint=safeLink(C.googleScriptUrl);if(!endpoint){return;}const id=++requestId;const callback='weddingWishesCallback'+id;const script=document.createElement('script');const timeout=setTimeout(cleanup,10000);function cleanup(){clearTimeout(timeout);script.remove();delete window[callback];}window[callback]=data=>{cleanup();if(data&&data.ok&&Array.isArray(data.wishes))renderWishes(data.wishes);};script.onerror=cleanup;const u=new URL(endpoint);u.searchParams.set('action','wishes');u.searchParams.set('callback',callback);u.searchParams.set('_',Date.now());script.src=u.href;document.head.append(script);}
$('refresh-wishes').addEventListener('click',loadWishes);loadWishes();setInterval(loadWishes,Math.max(10,C.refreshWishesSeconds||30)*1000);
$('rsvp-form').addEventListener('submit',async(e)=>{e.preventDefault();const endpoint=safeLink(C.googleScriptUrl);if(!endpoint){text('form-status','RSVP belum aktif: pemilik undangan perlu memasang URL Google Apps Script di config.js.');return;}
const form=e.currentTarget,btn=$('submit-btn');if(form.elements.website.value)return;const data=new URLSearchParams();data.set('name',form.elements.name.value.trim());data.set('attendance',attendance.value);data.set('guests',attendance.value==='Tidak Hadir'?'0':guests.value);data.set('message',form.elements.message.value.trim());data.set('website','');if(!data.get('name')||!data.get('attendance')||!data.get('message'))return;
btn.disabled=true;text('form-status','Mengirim konfirmasi kehadiran...');
try {await fetch(endpoint,{method:'POST',mode:'no-cors',body:data,redirect:'follow'});text('form-status','Permintaan telah dikirim. Periksa daftar ucapan beberapa saat lagi untuk memastikan data tersimpan.');form.reset();guests.disabled=false;setTimeout(loadWishes,2200);} catch(err){text('form-status','Gagal mengirim. Periksa koneksi internet lalu coba lagi.');}finally{btn.disabled=false;}
});
if(C.musicUrl){const u=safeLink(C.musicUrl)||new URL(C.musicUrl,location.href).href;const audio=new Audio(u);audio.loop=true;const toggle=$('music-toggle');toggle.hidden=false;toggle.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();toggle.textContent='♫';toggle.setAttribute('aria-label','Jeda musik');}catch{}}else{audio.pause();toggle.textContent='♪';toggle.setAttribute('aria-label','Putar musik');}});}
})();

const weddingMusic = document.getElementById("wedding-music");
const musicButton = document.getElementById("music-toggle");
const openInvitation = document.getElementById("open-invitation");

weddingMusic.volume = 0.35;

function updateMusicButton() {
  musicButton.textContent = weddingMusic.paused ? "♫" : "❚❚";
}

openInvitation.addEventListener("click", () => {
  weddingMusic.play().then(updateMusicButton).catch(() => {});
});

musicButton.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
    } catch (error) {
      console.warn("Musik tidak dapat diputar:", error);
    }
  } else {
    weddingMusic.pause();
  }
  updateMusicButton();
});

weddingMusic.addEventListener("play", updateMusicButton);
weddingMusic.addEventListener("pause", updateMusicButton);
