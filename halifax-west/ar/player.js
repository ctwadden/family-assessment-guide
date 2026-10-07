'use strict';
(() => {
 const scenes=window.assessmentScenes,video=document.querySelector('#film'),audio=document.querySelector('#audio'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let media=video,current=-1;
 function sync(){const i=Math.max(0,scenes.findLastIndex(s=>media.currentTime>=s.start));if(i===current)return;current=i;document.querySelectorAll('[data-chapter]').forEach((b,n)=>n===i?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));document.querySelector('#still').src=`assets/chapter-${i}.jpg`;document.querySelector('#still').alt=scenes[i].title;}
 function mode(){const time=media.currentTime;media.pause();media=reduced.matches?audio:video;media.currentTime=time;video.hidden=reduced.matches;document.querySelector('#still-player').hidden=!reduced.matches;document.querySelector('#motion-note').hidden=!reduced.matches;current=-1;sync();}
 for(const m of [video,audio]){m.addEventListener('timeupdate',()=>{if(m===media)sync()});m.addEventListener('error',()=>document.querySelector('#error').hidden=false);}
 document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{media.currentTime=scenes[Number(b.dataset.chapter)].start;sync()}));
 reduced.addEventListener('change',mode);mode();
})();
