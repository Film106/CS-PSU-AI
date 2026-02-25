/* ══════════════════════════════
   PARTICLES
══════════════════════════════ */
(() => {
    const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
    let W, H, pts = [];
    const rz = () => { W = cv.width = innerWidth; H = cv.height = innerHeight };
    rz(); addEventListener('resize', rz);
    class P {
        constructor() { this.r() }
        r() {
            this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .3; this.vy = (Math.random() - .5) * .3; this.s = Math.random() * 1.6 + .3; this.a = Math.random() * .3 + .05;
            this.hue = 180 + Math.random() * 60
        }
        tick() { this.x += this.vx; this.y += this.vy; if (this.x < 0) this.x = W; if (this.x > W) this.x = 0; if (this.y < 0) this.y = H; if (this.y > H) this.y = 0 }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fillStyle = `hsla(${this.hue},100%,60%,${this.a})`; ctx.fill() }
    }
    for (let i = 0; i < 90; i++)pts.push(new P());
    const loop = () => {
        ctx.clearRect(0, 0, W, H); pts.forEach(p => { p.tick(); p.draw() });
        for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
                ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                g.addColorStop(0, `hsla(${pts[i].hue},100%,60%,${(1 - d / 90) * .08})`);
                g.addColorStop(1, `hsla(${pts[j].hue},100%,60%,${(1 - d / 90) * .08})`);
                ctx.strokeStyle = g; ctx.lineWidth = .5; ctx.stroke()
            }
        }
        ctx.globalAlpha = 1; requestAnimationFrame(loop);
    };
    loop();
})();

/* ══════════════════════════════
   CURSOR GLOW TRAIL
══════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
    document.addEventListener('mousemove', e => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

/* ══════════════════════════════
   SCROLL REVEAL (all reveal types)
══════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => observer.observe(el));

/* ══════════════════════════════
   COUNT-UP ANIMATION
══════════════════════════════ */
function animateCountUp() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer) }
            el.textContent = prefix + current + suffix;
        }, 30);
    });
}
const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCountUp(); statsObs.unobserve(e.target) } });
}, { threshold: 0.3 });
const statsEl = document.getElementById('stats-section');
if (statsEl) statsObs.observe(statsEl);

/* ══════════════════════════════
   3D TILT + GRADIENT BORDER ROTATE
══════════════════════════════ */
document.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const x = (px - .5) * 14;
        const y = (py - .5) * -14;
        card.style.transform = `translateY(-8px) rotateY(${x}deg) rotateX(${y}deg)`;
        // rotate gradient border based on mouse angle
        const angle = Math.atan2(py - .5, px - .5) * (180 / Math.PI);
        card.style.setProperty('--card-angle', angle + 'deg');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = '' });
});

/* ══════════════════════════════
   MAGNETIC BUTTON EFFECT
══════════════════════════════ */
document.querySelectorAll('.hero-cta, .start-quiz-btn').forEach(btn => {
    btn.classList.add('magnetic');
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * .15}px, ${dy * .15}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = '' });
});

/* ══════════════════════════════
   RIPPLE CLICK EFFECT
══════════════════════════════ */
document.querySelectorAll('.hero-cta, .start-quiz-btn, .opt, .ra').forEach(el => {
    el.classList.add('ripple');
    el.addEventListener('click', e => {
        const r = el.getBoundingClientRect();
        const wave = document.createElement('span');
        wave.className = 'ripple-wave';
        const size = Math.max(r.width, r.height);
        wave.style.width = wave.style.height = size + 'px';
        wave.style.left = (e.clientX - r.left - size / 2) + 'px';
        wave.style.top = (e.clientY - r.top - size / 2) + 'px';
        el.appendChild(wave);
        setTimeout(() => wave.remove(), 600);
    });
});

/* ══════════════════════════════
   PARALLAX ON SCROLL
══════════════════════════════ */
const parallaxElements = document.querySelectorAll('.orb,.hero-float');
window.addEventListener('scroll', () => {
    const st = window.scrollY;
    parallaxElements.forEach((el, i) => {
        const speed = .03 + (i % 4) * .015;
        el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/, '') + ` translateY(${st * speed}px)`;
    });
}, { passive: true });

/* ══════════════════════════════
   NAV SHRINK ON SCROLL
══════════════════════════════ */
const topNav = document.querySelector('.top-nav');
if (topNav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            topNav.style.padding = '8px 28px';
            topNav.style.borderBottomColor = 'rgba(0,229,255,.15)';
        } else {
            topNav.style.padding = '14px 28px';
            topNav.style.borderBottomColor = '';
        }
    }, { passive: true });
}

/* ══════════════════════════════
   TYPEWRITER EFFECT FOR HERO SUB
══════════════════════════════ */
const heroSub = document.querySelector('.hero-sub');
if (heroSub && !heroSub.dataset.typed) {
    heroSub.dataset.typed = '1';
    const originalHTML = heroSub.innerHTML;
    // Add blinking cursor after load
    setTimeout(() => {
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        heroSub.appendChild(cursor);
        setTimeout(() => cursor.remove(), 3000);
    }, 1800);
}

/* ══════════════════════════════
   QUIZ DATA
══════════════════════════════ */
const QUESTIONS = [
    {
        q: "ถ้าต้องเลือกทำโปรเจกต์เดี๋ยวนี้เลย คุณอยากทำอะไรมากที่สุด?", opts: [
            { t: "สร้าง Web App / Mobile App ให้คนใช้ได้จริง", w: [4, 0, 0, 0] },
            { t: "วิเคราะห์ข้อมูล หาแพทเทิร์นที่ซ่อนอยู่ในตัวเลข", w: [0, 4, 1, 0] },
            { t: "สร้าง AI / Chatbot ที่คุยกับคนได้", w: [0, 2, 4, 0] },
            { t: "ออกแบบระบบ Network ให้ปลอดภัยจาก Hacker", w: [0, 0, 0, 4] }]
    },
    {
        q: "วิชาไหนที่คุณชอบเรียนมากที่สุดตอน ม.ปลาย?", opts: [
            { t: "คณิตศาสตร์ — ชอบแก้โจทย์ พิสูจน์สูตร", w: [2, 3, 2, 1] },
            { t: "ฟิสิกส์ — ชอบเข้าใจว่าอะไรทำงานยังไง", w: [1, 1, 3, 2] },
            { t: "คอมพิวเตอร์ — ชอบเขียนโค้ด ทำเว็บ", w: [4, 1, 1, 2] },
            { t: "เคมี/ชีวะ — ชอบทดลอง หาความจริง", w: [0, 3, 2, 0] }]
    },
    {
        q: "สไตล์การทำงานของคุณตรงกับอันไหนมากที่สุด?", opts: [
            { t: "สร้างสิ่งที่จับต้องได้ มี UI สวย ๆ ให้ user ใช้งาน", w: [4, 0, 0, 0] },
            { t: "นั่งไล่ดูข้อมูล หา insight ที่คนอื่นมองไม่เห็น", w: [0, 4, 1, 0] },
            { t: "คิด algorithm ใหม่ ๆ ให้คอมพิวเตอร์ฉลาดขึ้น", w: [1, 2, 4, 0] },
            { t: "ป้องกัน ตรวจจับ รับมือภัยคุกคามทางดิจิทัล", w: [0, 0, 1, 4] }]
    },
    {
        q: "ถ้าบริษัท Tech ใหญ่รับคุณเข้าทำงาน คุณอยากเป็นอะไร?", opts: [
            { t: "Full-Stack Developer — สร้าง product ตั้งแต่ต้นจนจบ", w: [4, 0, 0, 1] },
            { t: "Data Scientist — เอาข้อมูลมาสร้าง business value", w: [0, 4, 1, 0] },
            { t: "ML Engineer — train model ให้ฉลาดกว่าคน", w: [1, 2, 4, 0] },
            { t: "Security Engineer — ดูแลให้ระบบปลอดภัย", w: [0, 0, 0, 4] }]
    },
    {
        q: "เวลาเจอปัญหา คุณแก้ยังไง?", opts: [
            { t: "แบ่งเป็นชิ้นเล็ก ๆ แล้วค่อย ๆ แก้ทีละส่วน", w: [3, 2, 2, 2] },
            { t: "หาข้อมูลเยอะ ๆ ก่อน แล้วหาแพทเทิร์น", w: [1, 4, 2, 1] },
            { t: "ลอง approach ใหม่ที่ไม่มีใครเคยทำ", w: [1, 1, 4, 1] },
            { t: "หาว่าจุดอ่อนอยู่ที่ไหน แล้วปิดช่องโหว่", w: [1, 1, 1, 4] }]
    },
    {
        q: "โปรเจกต์แบบไหนที่ทำให้คุณตื่นเต้นที่สุด?", opts: [
            { t: "แอปที่มีคนจริง ๆ ใช้เป็นล้านคน", w: [4, 1, 0, 0] },
            { t: "ระบบพยากรณ์ราคาหุ้น หรือผลการแข่งขัน", w: [0, 4, 2, 0] },
            { t: "AI ที่จำแนกโรคจากภาพ X-ray ได้แม่นกว่าหมอ", w: [0, 1, 4, 1] },
            { t: "ระบบตรวจจับ intrusion ที่ block hacker แบบ real-time", w: [0, 0, 1, 4] }]
    },
    {
        q: "Python vs JavaScript — ถ้าต้องเลือกเรียนลึกสักภาษา?", opts: [
            { t: "JavaScript / TypeScript — front-end, back-end, ทุกอย่าง", w: [4, 0, 0, 1] },
            { t: "Python — data, ML, automation ครบจบในภาษาเดียว", w: [0, 4, 3, 0] },
            { t: "C++ / Rust — performance, robotics, low-level สุด ๆ", w: [1, 0, 4, 2] },
            { t: "Go / Bash — network, server, security tools", w: [1, 1, 0, 4] }]
    },
    {
        q: "เพื่อนมักมาขอให้คุณช่วยเรื่องอะไร?", opts: [
            { t: "ทำเว็บ ทำแอป ออกแบบ UI ให้สวย", w: [4, 0, 0, 0] },
            { t: "วิเคราะห์ตัวเลข ทำ report สรุปข้อมูล", w: [0, 4, 1, 0] },
            { t: "อธิบายเรื่อง AI / algorithm ที่ซับซ้อน", w: [1, 2, 4, 0] },
            { t: "ตั้งค่า VPN, แก้ปัญหา network หรือความปลอดภัย", w: [0, 0, 1, 4] }]
    },
    {
        q: "5 ปีข้างหน้า คุณเห็นตัวเองอยู่ที่ไหน?", opts: [
            { t: "เป็น CTO หรือ Tech Lead ดูแล product ใหญ่ ๆ", w: [4, 1, 1, 1] },
            { t: "เป็น Lead Data Scientist ใน fintech หรือ healthcare", w: [0, 4, 1, 0] },
            { t: "ทำ research AI ใน lab ระดับโลก หรือ startup AI", w: [0, 2, 4, 0] },
            { t: "เป็น CISO หรือ Security Consultant ระดับองค์กร", w: [0, 0, 1, 4] }]
    },
    {
        q: "สุดท้าย — ถ้าต้องบรรยายตัวเองในหนึ่งคำ คุณเลือกอะไร?", opts: [
            { t: "Builder — ฉันชอบสร้างสิ่งใหม่จากศูนย์", w: [4, 1, 1, 0] },
            { t: "Analyst — ฉันชอบหาความหมายจากข้อมูล", w: [0, 4, 1, 0] },
            { t: "Innovator — ฉันชอบคิดอะไรที่ไม่มีใครเคยทำ", w: [1, 1, 4, 0] },
            { t: "Guardian — ฉันชอบปกป้องและดูแลระบบให้มั่นคง", w: [0, 0, 0, 4] }]
    }
];

const TRACKS = [
    {
        id: 'se', name: 'Software Engineering', color: 'var(--cyan)',
        fill: 'linear-gradient(90deg,#0ea5e9,#00e5ff)',
        tags: ['Web Dev', 'Mobile App', 'System Design', 'DevOps', 'Cloud'],
        desc: 'คุณชอบสร้างสิ่งที่จับต้องได้และมีผู้ใช้งานจริง มีความสามารถด้านการพัฒนาซอฟต์แวร์และ product thinking สายนี้จะพาคุณไปสู่การเป็น Full-Stack Developer หรือ Tech Lead ที่สามารถ deliver product ได้ตั้งแต่ต้นจนจบ',
        roadmap: 'Year 1-2: Programming, OOP, Database → Year 3: Web/Mobile, Agile, Cloud → Year 4: Senior Project, Internship'
    },
    {
        id: 'ds', name: 'Data Science', color: '#38bdf8',
        fill: 'linear-gradient(90deg,#0284c7,#38bdf8)',
        tags: ['Machine Learning', 'Python', 'Statistics', 'Data Viz', 'Big Data'],
        desc: 'คุณมีความสามารถในการมองหาแพทเทิร์นและวิเคราะห์ข้อมูล ชอบตั้งคำถามและหาคำตอบจากตัวเลข สายนี้จะพาคุณเป็น Data Scientist หรือ ML Engineer ที่สามารถเปลี่ยนข้อมูลดิบเป็น business insight ได้',
        roadmap: 'Year 1-2: Math, Stats, Python → Year 3: ML, Deep Learning, Visualization → Year 4: Research Project'
    },
    {
        id: 'is', name: 'Intelligent Systems', color: '#818cf8',
        fill: 'linear-gradient(90deg,#4f46e5,#818cf8)',
        tags: ['AI/ML', 'Computer Vision', 'NLP', 'Robotics', 'Deep Learning'],
        desc: 'คุณมีความคิดสร้างสรรค์และชอบ challenge ที่ยาก ต้องการทำให้คอมพิวเตอร์ฉลาดขึ้น สายนี้เหมาะถ้าคุณอยากทำ research AI หรือสร้างระบบอัจฉริยะที่เปลี่ยนโลกได้',
        roadmap: 'Year 1-2: Math, Algorithm, Python → Year 3: AI, Computer Vision, NLP → Year 4: AI Research Project'
    },
    {
        id: 'ns', name: 'Network & Security', color: '#34d399',
        fill: 'linear-gradient(90deg,#059669,#34d399)',
        tags: ['Cybersecurity', 'Network Admin', 'Cloud', 'Penetration Testing', 'Forensics'],
        desc: 'คุณมีทัศนคติแบบ Guardian ชอบปกป้องและวิเคราะห์ระบบ สายนี้จะพาคุณสู่การเป็น Security Engineer หรือ Network Architect ที่เป็นที่ต้องการอย่างมากในยุคดิจิทัล',
        roadmap: 'Year 1-2: Network, OS, Linux → Year 3: Security, Cryptography, Ethical Hacking → Year 4: Security Project'
    }
];

/* ══════════════════════════════
   STATE & REFS
══════════════════════════════ */
let step = 0, scores = [0, 0, 0, 0];
const TOTAL = 10;
const landing = document.getElementById('landing');
const quizMode = document.getElementById('quiz-mode');
const msgs = document.getElementById('messages');
const prog = document.getElementById('prog');
const sctr = document.getElementById('sctr');
const snum = document.getElementById('snum');

/* ══════════════════════════════
   START QUIZ
══════════════════════════════ */
document.querySelectorAll('.start-quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        landing.classList.add('hidden');
        quizMode.classList.add('active');
        showQ(0);
    });
});

/* ══════════════════════════════
   BACK TO LANDING
══════════════════════════════ */
document.getElementById('back-btn').addEventListener('click', () => {
    quizMode.classList.remove('active');
    landing.classList.remove('hidden');
    scores = [0, 0, 0, 0]; step = 0;
    msgs.innerHTML = '';
    prog.style.width = '0%';
    snum.textContent = '1';
});

/* ══════════════════════════════
   SHOW QUESTION
══════════════════════════════ */
function showQ(idx) {
    step = idx; snum.textContent = idx + 1;
    prog.style.width = ((idx / TOTAL) * 100) + '%';
    const q = QUESTIONS[idx];
    showTyping(() => {
        const labels = ['A', 'B', 'C', 'D'];
        let html = `<div class="stag">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      คำถาม ${idx + 1} / ${TOTAL}
    </div>
    <div style="margin-bottom:12px">${q.q}</div>
    <div class="opts" id="opts-${idx}">`;
        q.opts.forEach((o, i) => {
            html += `<button class="opt" onclick="pickOpt(${idx},${i},this)">
        <span class="olabel">${labels[i]}</span><span>${o.t}</span></button>`;
        });
        html += `</div>`;
        addAI(html);
    });
}

/* ══════════════════════════════
   PICK OPTION
══════════════════════════════ */
function pickOpt(qIdx, oIdx, btn) {
    document.querySelectorAll(`#opts-${qIdx} .opt`).forEach(b => b.classList.add('dead'));
    btn.classList.add('sel'); btn.classList.remove('dead');
    const w = QUESTIONS[qIdx].opts[oIdx].w;
    w.forEach((v, i) => scores[i] += v);
    const labels = ['A', 'B', 'C', 'D'];
    addUser(`${labels[oIdx]}: ${QUESTIONS[qIdx].opts[oIdx].t}`);
    setTimeout(() => {
        if (qIdx + 1 < TOTAL) showQ(qIdx + 1); else showResult();
    }, 450);
}

/* ══════════════════════════════
   SHOW RESULT
══════════════════════════════ */
function showResult() {
    prog.style.width = '100%'; sctr.style.display = 'none';
    const max = Math.max(...scores);
    const results = TRACKS.map((t, i) => ({ ...t, raw: scores[i], pct: Math.round((scores[i] / max) * 100) })).sort((a, b) => b.raw - a.raw);
    const top = results[0];
    showTyping(() => {
        let html = `<div class="stag" style="background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25);color:#34d399">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      การวิเคราะห์เสร็จสิ้น ✦</div>
    <div style="margin-bottom:4px">วิเคราะห์คำตอบทั้ง ${TOTAL} ข้อเสร็จแล้ว! สายที่แนะนำให้คุณมากที่สุดคือ <strong style="color:${top.color}">${top.name}</strong></div>
    <div class="res-box"><div class="res-title">ผลการวิเคราะห์</div>`;
        results.forEach((t, i) => {
            html += `<div class="rtrack"><div class="rrow">
        <span class="rname">${i === 0 ? '⭐ ' : i === 1 ? '✦ ' : ''}<strong style="color:${t.color}">${t.name}</strong></span>
        <span class="rpct" style="color:${t.color}">${t.pct}%</span></div>
        <div class="rbar"><div class="rfill" id="rf${i}" data-w="${t.pct}" style="background:${t.fill}"></div></div>
        <div class="rtags">${t.tags.map(g => `<span class="rtag">${g}</span>`).join('')}</div>
        ${i === 0 ? `<div class="res-reason">${t.desc}</div>` : ''}</div>`;
        });
        html += `<div style="margin-top:12px;padding:12px;background:rgba(255,255,255,.02);border-radius:8px;border:1px solid var(--border)">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--cyan);letter-spacing:.1em;margin-bottom:6px">ROADMAP</div>
      <div style="font-size:.78rem;color:var(--muted);line-height:1.7">${top.roadmap}</div></div>
    <div class="res-actions">
      <button class="ra" onclick="backToLanding()">← หน้าหลัก</button>
      <button class="ra pr" onclick="restartQuiz()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        ทำแบบทดสอบใหม่</button></div></div>`;
        addAI(html);
        setTimeout(() => { results.forEach((_, i) => { const el = document.getElementById('rf' + i); if (el) el.style.width = el.dataset.w + '%' }) }, 180);
    }, 900);
}

function restartQuiz() { scores = [0, 0, 0, 0]; step = 0; msgs.innerHTML = ''; sctr.style.display = 'flex'; prog.style.width = '0%'; snum.textContent = '1'; showQ(0) }
function backToLanding() { quizMode.classList.remove('active'); landing.classList.remove('hidden'); scores = [0, 0, 0, 0]; step = 0; msgs.innerHTML = ''; prog.style.width = '0%'; snum.textContent = '1'; sctr.style.display = 'flex' }

/* ══════════════════════════════
   UI HELPERS
══════════════════════════════ */
function showTyping(cb, delay = 800) {
    const d = document.createElement('div'); d.className = 'msg-ai'; d.style.cssText = 'animation:mIn .42s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(10px)'; d.id = 'typ';
    d.innerHTML = `<div class="av">${aiSVG()}</div><div class="ab"><div class="aname">CS PSU AI</div><div class="abubble"><div class="dots"><span></span><span></span><span></span></div></div></div>`;
    msgs.appendChild(d); scrollBot(); setTimeout(() => { d.remove(); cb() }, delay);
}
function addAI(html) {
    const d = document.createElement('div'); d.className = 'msg-ai'; d.style.cssText = 'animation:mIn .42s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(10px)';
    d.innerHTML = `<div class="av">${aiSVG()}</div><div class="ab"><div class="aname">CS PSU AI</div><div class="abubble">${html}</div></div>`;
    msgs.appendChild(d); scrollBot();
}
function addUser(text) {
    const d = document.createElement('div'); d.className = 'msg-user'; d.style.cssText = 'animation:mIn .42s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(10px)';
    d.innerHTML = `<div class="ububble">${text}</div>`; msgs.appendChild(d); scrollBot();
}
function scrollBot() { const m = document.getElementById('quiz-main'); setTimeout(() => m.scrollTop = m.scrollHeight, 80) }
function aiSVG() { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="1.4" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>` }
