
const API=""; // https://script.google.com/macros/s/AKfycbzhSOiT16QwnmYVZYe_zJQAJOvp68BCmy3WEYoLH3zVUZPA0z7zUrc6kBA0-66vTE90uA/exec
const chapters=[
{n:1,t:"Berpikir Komputasional",tp:["Dekomposisi, pola, abstraksi, algoritma","Strategi pemecahan masalah","Representasi solusi"],act:"Menganalisis masalah sehari-hari dengan 4 pilar berpikir komputasional"},
{n:2,t:"Algoritma dan Pemrograman Lanjut",tp:["Algoritma dasar","Flowchart & pseudocode","Sequence, selection, iteration"],act:"Menyusun algoritma dan flowchart sebuah masalah"},
{n:3,t:"Literasi dan Etika Kecerdasan Artifisial",tp:["Pola citra dan suara","Profesi bidang KA","Dampak dan etika AI"],act:"Menganalisis contoh penggunaan AI secara etis"},
{n:4,t:"Prompt Engineering & Evaluasi AI",tp:["Struktur prompt","Iterasi prompt","Evaluasi keluaran AI"],act:"Membandingkan prompt dan memperbaiki kualitas keluaran"},
{n:5,t:"Kreativitas & Etika Produksi Konten",tp:["Ide konten AI","Hak cipta dan atribusi","Literasi media sosial"],act:"Merancang konsep konten AI yang bertanggung jawab"},
{n:6,t:"Perancangan Sistem AI",tp:["Identifikasi masalah","Design thinking","Prototipe dan evaluasi"],act:"Merancang solusi AI sederhana untuk masalah nyata"}
];
let qs=[
{b:1,q:"Memecah masalah besar menjadi bagian kecil disebut...",o:["Abstraksi","Dekomposisi","Iterasi","Sorting","Kompilasi"],a:1},
{b:2,q:"Struktur yang memilih tindakan berdasarkan kondisi adalah...",o:["Sequence","Selection","Iteration","Input","Output"],a:1},
{b:2,q:"Simbol flowchart untuk keputusan adalah...",o:["Oval","Persegi panjang","Jajar genjang","Belah ketupat","Panah"],a:3},
{b:3,q:"Salah satu aspek etika AI adalah...",o:["Mengabaikan sumber data","Mempertimbangkan privasi dan dampak","Selalu percaya output AI","Menghapus evaluasi","Menghindari transparansi"],a:1},
{b:4,q:"Prompt yang baik umumnya memiliki...",o:["Tujuan/konteks yang jelas","Kata acak","Tanpa instruksi","Hanya satu kata","Tidak perlu batasan"],a:0},
{b:5,q:"Saat membuat konten dengan AI, hal yang perlu diperhatikan adalah...",o:["Hak cipta dan atribusi","Menghapus sumber","Menyamarkan fakta","Menyalin tanpa izin","Mengabaikan konteks"],a:0},
{b:6,q:"Tahap awal design thinking yang berfokus memahami pengguna adalah...",o:["Empathize","Deploy","Compile","Sort","Debug"],a:0}
];
let S={role:null,user:null,att:{},scores:[],ref:{},lkpd:{},activeChapter:1};
const $ = id => document.getElementById(id);

function toast(x){let t=$("toast");t.textContent=x;t.classList.remove("hide");setTimeout(()=>t.classList.add("hide"),2200)}
function save(){localStorage.setItem("lmsKKA4",JSON.stringify(S))}
function send(type,data={}){let p={type,...data,name:S.user?.name||"",nisn:S.user?.nisn||"",className:S.user?.className||"",role:S.role,timestamp:new Date().toISOString()};if(API)fetch(API,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(p)}).catch(()=>{});return p}
function activateRole(r){
  const sf=$("studentForm"), tf=$("teacherForm"), st=$("studentTab"), tt=$("teacherTab");
  if(!sf||!tf||!st||!tt) return;
  sf.classList.toggle("hide",r!=="student");
  tf.classList.toggle("hide",r!=="teacher");
  st.className="btn "+(r==="student"?"primary":"secondary");
  tt.className="btn "+(r==="teacher"?"primary":"secondary");
}

function loginStudent(){let name=$("sn").value.trim(),nisn=$("si").value.trim(),cl=$("sc").value;if(!name||!nisn||!cl)return toast("Lengkapi identitas siswa.");S.role="student";S.user={name,nisn,className:cl};save();send("LOGIN");openApp();studentNav();show("sdash")}
function loginTeacher(){if($("tu").value!=="guru"||$("tp").value!=="KKA2026")return toast("Username/password demo tidak sesuai.");S.role="teacher";S.user={name:"Guru KKA"};openApp();teacherNav();show("tdash")}
function openApp(){$("login").classList.add("hide");$("app").classList.remove("hide");$("who").textContent=S.role==="teacher"?"👨‍🏫 Guru/Admin":"👨‍🎓 "+S.user.name}
function nav(items){document.getElementById("nav").innerHTML=items.map(x=>`<button onclick="show('${x[0]}')">${x[1]} <span>${x[2]}</span></button>`).join("")}
function studentNav(){nav([["sdash","🏠","Dashboard"],["chapters","📚","Bab 1–6"],["lesson","🎯","Pertemuan"],["presensi","🗓️","Presensi"],["eval","🧠","Evaluasi"],["reflection","✍️","Refleksi"]])}
function teacherNav(){nav([["tdash","📊","Dashboard Guru"],["students","👥","Database Siswa"],["grades","📈","Rekap Nilai"],["bank","🧩","Bank Soal"],["content","📚","Kurikulum"],["exports","⬇️","Ekspor Data"]])}
function show(p){document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("on"));[...document.querySelectorAll(".nav button")].find(b=>b.getAttribute("onclick")?.includes("'"+p+"'"))?.classList.add("on");({sdash:studentDash,chapters:chapterPage,lesson:lessonPage,presensi:attendance,eval:evaluation,reflection:reflection,tdash:teacherDash,students:students,grades:grades,bank:bank,content:curriculum,exports:exports}[p])();$("pt").textContent=p}
function logout(){
  // Hapus hanya sesi/progres lokal dari perangkat ini.
  // Data yang sudah dikirim ke Google Sheets tetap tersimpan.
  try{ localStorage.removeItem("lmsKKA4"); }catch(e){}
  S={role:null,user:null,att:{},scores:[],ref:{},lkpd:{},activeChapter:1};
  document.getElementById("app").classList.add("hide");
  document.getElementById("login").classList.remove("hide");
  role("student");
  const sn=document.getElementById("sn"), si=document.getElementById("si"), sc=document.getElementById("sc");
  if(sn) sn.value=""; if(si) si.value=""; if(sc) sc.value="";
  toast("Anda sudah keluar dari LMS.");
}
function studentDash(){let done=Object.keys(S.att).length+(S.scores.length?1:0)+Object.keys(S.ref).length+Object.keys(S.lkpd).length;let pct=Math.min(100,Math.round(done/4*100));$("content").innerHTML=`<div class=title><h2>Halo, ${S.user.name} 👋</h2><p class=muted>Selamat belajar di LMS KKA SMAN 2 Tualang.</p></div><div class="grid g4"><div class=card><span class=muted>Progres</span><div class=metric>${pct}%</div><div class=bar><i style="width:${pct}%"></i></div></div><div class=card><span class=muted>Bab Aktif</span><div class=metric>${S.activeChapter}</div></div><div class=card><span class=muted>Evaluasi</span><div class=metric>${S.scores.length}</div></div><div class=card><span class=muted>Presensi</span><div class=metric>${Object.keys(S.att).length}</div></div></div><div class="section card"><h3>Jalur Belajar KKA</h3>${chapters.map(c=>`<div class=lesson><b>Bab ${c.n} — ${c.t}</b><br><span class=muted>${c.tp[0]} • ${c.tp[1]}</span><br><button class="btn secondary" style="margin-top:8px" onclick="S.activeChapter=${c.n};save();show('lesson')">Mulai Bab ${c.n} →</button></div>`).join("")}</div>`}
function chapterPage(){$("content").innerHTML=`<div class=title><h2>Materi Bab 1–6</h2><p class=muted>Pilih bab yang ingin dipelajari.</p></div><div class="grid g3">${chapters.map(c=>`<div class="card chapter"><span class=tag>Bab ${c.n}</span><h3>${c.t}</h3><p class=muted>${c.tp.join(" • ")}</p><button class="btn primary" onclick="S.activeChapter=${c.n};save();show('lesson')">Pelajari →</button></div>`).join("")}</div>`}
function lessonPage(){let c=chapters[S.activeChapter-1];$("content").innerHTML=`<div class=title><h2>Bab ${c.n}: ${c.t}</h2><p class=muted>Pertemuan 1 • Tujuan, materi, aktivitas, LKPD, dan refleksi.</p></div><div class=card><h3>🎯 Tujuan Pembelajaran</h3><ul>${c.tp.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="section card"><h3>📖 Materi Inti</h3><p>Pelajari konsep <b>${c.tp[0]}</b> melalui contoh kontekstual, diskusi, latihan, dan aktivitas pemecahan masalah. Guru dapat memperkaya bagian ini dengan video, PDF, atau tautan sumber belajar sekolah.</p><div class=flow><div class=node>Masalah</div><b>→</b><div class=node>Analisis</div><b>→</b><div class=node>Solusi</div><b>→</b><div class=node>Evaluasi</div></div></div><div class="section card"><h3>⚡ Aktivitas Interaktif</h3><p>${c.act}</p><button class="btn success" onclick="S.lkpd[S.activeChapter]=true;save();send('ACTIVITY',{chapter:S.activeChapter});toast('Aktivitas Bab '+S.activeChapter+' selesai.')">✓ Tandai Aktivitas Selesai</button></div><div class="section card"><h3>📄 LKPD Digital</h3><textarea id=lk rows=6 placeholder="Tuliskan jawaban/hasil kerja LKPD di sini..."></textarea><button class="btn primary" style="margin-top:10px" onclick="saveLKPD()">Simpan LKPD</button></div><div class=actions><button class="btn secondary" onclick="show('chapters')">← Semua Bab</button><button class="btn primary" onclick="show('eval')">Lanjut Evaluasi →</button></div>`}
function saveLKPD(){let v=document.getElementById("lk").value.trim();if(!v)return toast("LKPD belum diisi.");S.lkpd[S.activeChapter]=v;save();send("LKPD",{chapter:S.activeChapter,response:v});toast("LKPD tersimpan.")}
function attendance(){let k="B"+S.activeChapter,d=S.att[k]||"";$("content").innerHTML=`<div class=title><h2>Presensi</h2><p class=muted>Presensi pembelajaran Bab ${S.activeChapter}.</p></div><div class=card style=max-width:650px><h3>Status Kehadiran</h3><div class=g2 grid><button class="btn ${d==="Hadir"?"success":"secondary"}" onclick="setAtt('Hadir')">✓ Hadir</button><button class="btn ${d==="Izin"?"primary":"secondary"}" onclick="setAtt('Izin')">Izin</button></div><p style=margin-top:15px>Status: <b>${d||"Belum diisi"}</b></p></div>`}
function setAtt(v){S.att["B"+S.activeChapter]=v;save();send("ATTENDANCE",{chapter:S.activeChapter,attendance:v});toast("Presensi tersimpan.");attendance()}
function evaluation(){let arr=qs.filter(q=>q.b===S.activeChapter);if(arr.length<3)arr=qs;$("content").innerHTML=`<div class=title><h2>Evaluasi Bab ${S.activeChapter}</h2><p class=muted>Jawab pertanyaan berikut. Nilai otomatis dihitung.</p></div><div class=card>${arr.map((q,i)=>`<div class=q><b>${i+1}. ${q.q}</b>${q.o.map((o,j)=>`<label class=opt><input type=radio name=q${i} value=${j}> ${String.fromCharCode(65+j)}. ${o}</label>`).join("")}</div>`).join("")}<button class="btn primary" onclick="submitEval()">Selesai & Lihat Nilai</button><div id=res style=margin-top:12px></div></div>`}
function submitEval(){let arr=qs.filter(q=>q.b===S.activeChapter);if(arr.length<3)arr=qs;let sc=arr.reduce((n,q,i)=>n+(document.querySelector(`input[name=q${i}]:checked`)?.value==q.a?1:0),0);let score=Math.round(sc/arr.length*100);S.scores.push({chapter:S.activeChapter,score,date:new Date().toLocaleString("id-ID")});save();send("EVALUATION",{chapter:S.activeChapter,score});$("res").innerHTML=`<div class=card style="background:#eef9f4"><b>Nilai: ${score}</b><br>${score>=75?"Capaian pembelajaran memenuhi batas yang ditetapkan.":"Tinjau kembali materi dan lakukan latihan tambahan."}</div>`}
function reflection(){$("content").innerHTML=`<div class=title><h2>Refleksi Pembelajaran</h2><p class=muted>Tuliskan pemahaman dan hal yang masih perlu dipelajari.</p></div><div class=card><textarea id=rf rows=9 placeholder="Hari ini saya memahami...">${S.ref[S.activeChapter]||""}</textarea><button class="btn success" style=margin-top:10px onclick="saveRef()">Simpan Refleksi</button></div>`}
function saveRef(){let v=$("rf").value.trim();if(!v)return toast("Refleksi belum diisi.");S.ref[S.activeChapter]=v;save();send("REFLECTION",{chapter:S.activeChapter,reflection:v});toast("Refleksi tersimpan.")}
function teacherDash(){let avg=S.scores.length?Math.round(S.scores.reduce((a,x)=>a+x.score,0)/S.scores.length):0;$("content").innerHTML=`<div class=title><h2>Dashboard Guru</h2><p class=muted>Monitoring pembelajaran KKA Kelas X.</p></div><div class=g4 grid><div class=card><span class=muted>Peserta Terdaftar</span><div class=metric>—</div></div><div class=card><span class=muted>Evaluasi Terekam</span><div class=metric>${S.scores.length}</div></div><div class=card><span class=muted>Rata-rata Lokal</span><div class=metric>${avg||"—"}</div></div><div class=card><span class=muted>Bab</span><div class=metric>6</div></div></div><div class="section grid g2"><div class=card><h3>Progress Kurikulum</h3>${chapters.map(c=>`<p><b>Bab ${c.n}</b> — ${c.t}<div class=bar><i style="width:${Math.min(100,c.n*16.66)}%"></i></div></p>`).join("")}</div><div class=card><h3>Aksi Guru</h3><button class="btn primary" onclick="show('grades')">Lihat Rekap Nilai</button> <button class="btn secondary" onclick="show('bank')">Kelola Bank Soal</button><p class=muted style=margin-top:15px>Gunakan menu Kurikulum untuk mengatur tujuan, materi, LKPD, dan asesmen per Bab.</p></div></div>`}
function students(){$("content").innerHTML=`<div class=title><h2>Database Siswa</h2><p class=muted>Daftar peserta akan tersimpan melalui backend Google Sheets saat API dihubungkan.</p></div><div class=card><p>Database terpusat dapat dihubungkan melalui <b>Code.gs</b>. Untuk produksi, gunakan autentikasi sekolah dan pembatasan akses spreadsheet.</p></div>`}
function grades(){$("content").innerHTML=`<div class=title><h2>Rekap Nilai</h2><p class=muted>Rekap evaluasi yang terekam pada sesi ini.</p></div><div class=card><div class=tablewrap><table class=table><tr><th>No</th><th>Bab</th><th>Nilai</th><th>Waktu</th></tr>${S.scores.map((x,i)=>`<tr><td>${i+1}</td><td>Bab ${x.chapter}</td><td><b>${x.score}</b></td><td>${x.date}</td></tr>`).join("")||"<tr><td colspan=4>Belum ada data evaluasi.</td></tr>"}</table></div></div>`}
function bank(){$("content").innerHTML=`<div class=title><h2>Bank Soal</h2><p class=muted>Bank soal bawaan KKA dapat dikembangkan guru sesuai KKTP.</p></div><div class=card>${qs.map((q,i)=>`<div class=q><b>${i+1}. [Bab ${q.b}] ${q.q}</b><br><span class=muted>Kunci: ${String.fromCharCode(65+q.a)}</span></div>`).join("")}</div>`}
function curriculum(){$("content").innerHTML=`<div class=title><h2>Kurikulum & Perangkat Pembelajaran</h2><p class=muted>Hubungkan LMS dengan dokumen perangkat pembelajaran KKA.</p></div><div class=g3 grid>${chapters.map(c=>`<div class=card><span class=tag>Bab ${c.n}</span><h3>${c.t}</h3><p class=muted><b>TP:</b> ${c.tp.join("; ")}</p><p class=muted><b>Aktivitas:</b> ${c.act}</p><button class="btn secondary" onclick="toast('Editor materi Bab ${c.n} siap dikembangkan.')">Kelola Konten</button></div>`).join("")}</div>`}
function exports(){$("content").innerHTML=`<div class=title><h2>Ekspor Data</h2><p class=muted>Unduh data yang tersedia dalam format CSV.</p></div><div class=card><button class="btn primary" onclick="downloadCSV('rekap_nilai.csv',S.scores,['Bab','Nilai','Waktu'])">⬇ Ekspor Nilai</button><button class="btn secondary" onclick="downloadCSV('aktivitas_siswa.csv',Object.entries(S.lkpd).map(([b,v])=>({Bab:b,LKPD:v})),['Bab','LKPD'])">⬇ Ekspor LKPD</button></div>`}
function downloadCSV(file,rows,cols){let out=cols.join(",")+"\\n"+rows.map(r=>cols.map(c=>`"${String(r[c]??"").replaceAll('"','""')}"`).join(",")).join("\\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([out],{type:"text/csv"}));a.download=file;a.click()}
window.addEventListener("DOMContentLoaded", function(){
  const st = document.getElementById("studentTab");
  const tt = document.getElementById("teacherTab");
  const lb = document.getElementById("logoutBtn");
  if(st) st.addEventListener("click", function(){ activateRole("student"); });
  if(tt) tt.addEventListener("click", function(){ activateRole("teacher"); });
  if(lb) lb.addEventListener("click", logout);
  activateRole("student");
});
