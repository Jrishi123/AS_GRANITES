const NAMES=["Black Pearl","Black Forest","Black Galaxy","Jet Black","Absolute Black","Black Markino","Bengal Black","Impala Black","Premium Black"];
const SW=["assets/images/swatch-01.jpg","assets/images/swatch-02.jpg","assets/images/swatch-03.jpg","assets/images/swatch-04.jpg","assets/images/swatch-05.jpg","assets/images/swatch-07.jpg","assets/images/swatch-08.jpg","assets/images/swatch-09.jpg","assets/images/swatch-10.jpg"];
document.getElementById('sw').innerHTML=NAMES.map((n,i)=>'<figure><img loading="lazy" src="'+SW[i]+'" alt="'+n+' granite"><figcaption>'+n+'</figcaption></figure>').join('');
const state=JSON.parse(document.getElementById('state').textContent);
let filter='all';
const G=document.getElementById('gallery');
function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function renderGallery(){
  const items=state.media.filter(m=>filter==='all'||m.type===filter);
  G.innerHTML=items.length?items.map(m=>'<div class="it">'+(m.type==='video'?'<video controls preload="metadata" src="/_blob/'+m.id+'"></video>':'<img loading="lazy" src="/_blob/'+m.id+'" alt="'+esc(m.title)+'">')+(m.title?'<div class="cap">'+esc(m.title)+'</div>':'')+'</div>').join(''):'<p class="empty" style="column-span:all">Gallery coming soon.</p>';
}
document.getElementById('tabs').onclick=e=>{const f=e.target.dataset.f;if(!f)return;filter=f;[...e.currentTarget.children].forEach(b=>b.classList.toggle('on',b===e.target));renderGallery()};
renderGallery();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.card,.sw figure,.edges,h2,.map,#gallery').forEach((e,i)=>{e.classList.add('rv');e.style.transitionDelay=(i%4)*70+'ms';io.observe(e)});
addEventListener('scroll',()=>document.querySelector('nav').classList.toggle('sc',scrollY>10),{passive:true});
['wa','wb'].forEach(i=>{const b=document.getElementById(i);b.onclick=()=>{const t='Hello A.S. Granites, I am '+(qn.value||'')+'. Enquiry: '+(qm.value||'');window.open('https://wa.me/'+b.dataset.n+'?text='+encodeURIComponent(t),'_blank')}});

// ---- Admin (owner/editors only) ----
(function(){
const root=document.getElementById('adminRoot');let ready=false,assets,art;
const $=id=>document.getElementById(id),msg=t=>{$('msg').textContent=t};
function build(){
  root.innerHTML='<div id="panel"><div class="box"><h3>Admin – Photos &amp; Videos</h3><div id="gate" style="color:var(--mut);font-size:14px"></div><div id="tools" style="display:none"><p style="color:var(--mut);font-size:14px;margin-top:0">Choose photos/videos (up to 20 MB each), add an optional caption and press <b>Upload</b>. Then press <b>Publish changes</b> to make them live.</p><input type="file" id="fi" accept="image/*,video/*" multiple><input type="text" id="cp" placeholder="Caption for new uploads (optional)"><button class="btn" id="up">Upload</button><div id="list"></div></div><div id="msg"></div><div style="margin-top:14px"><button class="btn" id="pub" style="display:none">Publish changes</button><button class="btn" id="cl" style="background:#777">Close</button></div></div></div>';
  $('cl').onclick=()=>$('panel').classList.remove('open');
  $('list').onclick=e=>{const i=e.target.dataset.i;if(i===undefined)return;state.media.splice(+i,1);list();renderGallery();msg('Removed – press Publish changes to save.')};
  $('up').onclick=async()=>{const fs=[...$('fi').files];if(!fs.length)return msg('Choose files first.');
    for(const f of fs){try{msg('Uploading '+f.name+'…');const r=await assets.upload(f);state.media.push({id:r.id,type:(r.contentType||f.type).startsWith('video')?'video':'image',title:$('cp').value});}catch(err){msg('Failed: '+f.name+' ('+(err.message||err.code||'error')+')');return}}
    $('fi').value='';list();renderGallery();msg('Uploaded. Press Publish changes to go live.')};
  $('pub').onclick=async()=>{try{msg('Publishing…');
    const c=document.documentElement.cloneNode(true);
    c.querySelector('#state').textContent=JSON.stringify(state).replace(/</g,'\\u003c');
    c.querySelectorAll('.in').forEach(e=>e.classList.remove('in'));c.querySelectorAll('.rv').forEach(e=>{e.classList.remove('rv');e.style.transitionDelay=''});c.querySelector('nav').classList.remove('sc');
    c.querySelector('#gallery').innerHTML='';c.querySelector('#adminRoot').innerHTML='';c.querySelector('#sw').innerHTML='';
    await art.publish('<!doctype html>\n'+c.outerHTML);
  }catch(err){msg('Publish failed: '+(err.code||err.message||'error'))}};
}
function list(){$('list').innerHTML=state.media.map((m,i)=>'<div class="row">'+(m.type==='video'?'<video src="/_blob/'+m.id+'"></video>':'<img src="/_blob/'+m.id+'">')+'<span>'+esc(m.title||m.type)+'</span><button data-i="'+i+'">Delete</button></div>').join('')||'<p class="empty">No uploads yet.</p>'}
async function open(){
  if(!$('panel'))build();
  $('panel').classList.add('open');
  if(ready)return;
  $('gate').textContent='Checking access…';
  let why='';
  try{
    if(!window.claude){why='Admin works only on the claude.ai-hosted link (not in a downloaded or screenshot copy).'}
    else{
      const user=await claude.use('user');assets=await claude.use('assets');art=await claude.use('artifact');
      const ok=user?await user.canEdit():false;
      if(!ok)why='Please open this page while signed in to the claude.ai account that owns it (viewers cannot upload).';
      else if(!assets)why='Upload permission is not available for this account/page.';
      else if(!art)why='Publishing is not available for this account/page.';
    }
  }catch(e){why='Could not start admin: '+(e.message||e.code||'error')}
  if(why){$('gate').textContent=why;return}
  ready=true;$('gate').style.display='none';$('tools').style.display='block';$('pub').style.display='inline-block';list();
}
const a=$('adminLink');if(a)a.onclick=e=>{e.preventDefault();open()};
})();