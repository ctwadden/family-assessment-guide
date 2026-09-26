'use strict';
(() => {
 const scenes=window.assessmentScenes,total=scenes.at(-1).start+scenes.at(-1).duration;
 const film=document.getElementById('film'),audio=document.getElementById('audio');
 const play=document.getElementById('play'),seek=document.getElementById('seek'),sound=document.getElementById('sound');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let media=reduced.matches?audio:film,current=-1;
 seek.max=total;
 document.getElementById('motion-note').hidden=!reduced.matches;
 function sync(){
  const t=media.currentTime||0,i=Math.max(0,scenes.findLastIndex(s=>t>=s.start));
  seek.value=t;document.getElementById('clock').textContent=`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')} / 2:21`;
  play.textContent=media.ended?'Replay the guide':media.paused?'Play the guide':'Pause';
  if(i!==current){current=i;document.getElementById('chapter').textContent=`${String(i+1).padStart(2,'0')} / 10`;document.getElementById('scene-title').textContent=scenes[i].title;
   document.querySelectorAll('#chapters button').forEach((b,n)=>n===i?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
   if(reduced.matches){film.pause();film.currentTime=scenes[i].start+Math.min(6,scenes[i].duration-1);}
  }
  const cue=scenes[i].cues.find(c=>t-scenes[i].start>=c.start&&t-scenes[i].start<c.end);
  document.getElementById('scene-caption').textContent=cue?.text||scenes[i].text;
 }
 async function toggle(){if(!media.paused){media.pause();return}if(media.ended)media.currentTime=0;try{await media.play()}catch(e){document.getElementById('audio-status').hidden=false;}sync()}
 function go(t){media.currentTime=Math.min(total,Math.max(0,t));sync()}
 play.addEventListener('click',toggle);document.getElementById('restart').addEventListener('click',()=>go(0));seek.addEventListener('input',()=>go(Number(seek.value)));
 sound.addEventListener('change',()=>{film.muted=audio.muted=!sound.checked});
 for(const m of [film,audio])for(const e of ['timeupdate','play','pause','ended','loadedmetadata','seeked'])m.addEventListener(e,()=>{if(m===media)sync()});
 film.addEventListener('error',()=>{document.getElementById('asset-status').hidden=false});
 scenes.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`${i+1}. ${s.short}`;b.addEventListener('click',()=>go(s.start));document.getElementById('chapters').append(b);
 const h=document.createElement('h3'),p=document.createElement('p');h.textContent=`${i+1}. ${s.title}`;p.textContent=s.text;document.getElementById('transcript-body').append(h,p)});
 reduced.addEventListener('change',()=>{const t=media.currentTime;media.pause();media=reduced.matches?audio:film;media.currentTime=t;current=-1;document.getElementById('motion-note').hidden=!reduced.matches;sync()});
 document.querySelector('.player').addEventListener('keydown',e=>{if(e.target.matches('input,button'))return;if(e.code==='Space'){e.preventDefault();toggle()}if(e.code==='ArrowRight'){e.preventDefault();go(media.currentTime+5)}if(e.code==='ArrowLeft'){e.preventDefault();go(media.currentTime-5)}});
 window.assessmentFilm={scenes,total,getState:()=>({time:media.currentTime,paused:media.paused,reducedMotion:reduced.matches}),renderAt:go};
 sync();
})();
