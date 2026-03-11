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
    { q: "ฉันชอบมองหาความสัมพันธ์หรือรูปแบบที่ซ่อนอยู่ในชุดข้อมูลจำนวนมาก", type: "likert" },
    { q: "ฉันสนุกกับการนำข้อมูลมาสรุปผลเป็นแผนภูมิหรือกราฟเพื่อให้ผู้อื่นเข้าใจง่าย", type: "likert" },
    { q: "ฉันสนใจเรื่องการนำข้อมูลไปช่วยในการตัดสินใจทางธุรกิจหรือการพยากรณ์ยอดขาย", type: "likert" },
    { q: "ฉันชอบเขียน Query เพื่อดึงข้อมูลหรือจัดการฐานข้อมูลที่ซับซ้อน", type: "likert" },
    { q: "ฉันสนใจเรื่องความปลอดภัยของข้อมูลและการเข้ารหัสลับ (Cryptography)", type: "likert" },
    { q: "ฉันชอบตั้งค่าอุปกรณ์เครือข่าย สนใจว่าคอมพิวเตอร์คุยกันผ่านอินเทอร์เน็ตได้อย่างไร", type: "likert" },
    { q: "ฉันมีความสุขกับการแก้ปัญหาเรื่องความเสถียรและความปลอดภัยของระบบ Network", type: "likert" },
    { q: "ฉันสนใจการพัฒนาอุปกรณ์อัจฉริยะ (IoT) หรือระบบฝังตัว (Embedded Systems)", type: "likert" },
    { q: "ฉันสนใจเรื่อง Cloud Computing และการจัดการเซิร์ฟเวอร์เสมือน", type: "likert" },
    { q: "ฉันอยากรู้วิธีการป้องกันการโจรกรรมข้อมูลหรือการแฮกระบบเครือข่าย", type: "likert" },
    { q: "ฉันชอบออกแบบขั้นตอนการทำงานของโปรแกรมให้มีประสิทธิภาพและจัดการง่าย", type: "likert" },
    { q: "ฉันให้ความสำคัญกับการทดสอบซอฟต์แวร์ (Testing) เพื่อให้แน่ใจว่าโปรแกรมไม่มี Bug", type: "likert" },
    { q: "ฉันสนุกกับการออกแบบหน้าจอโปรแกรมให้สวยงามและใช้งานง่าย (UI/UX)", type: "likert" },
    { q: "ฉันสนใจกระบวนการจัดการโครงการซอฟต์แวร์และการทำงานเป็นทีม (Project Management)", type: "likert" },
    { q: "ฉันชอบการวิเคราะห์ระบบและออกแบบสถาปัตยกรรมของซอฟต์แวร์ (System Analysis)", type: "likert" },
    { q: "ฉันชอบวิชาที่ต้องใช้คณิตศาสตร์ ตรรกะ หรือการคำนวณเชิงลึก", type: "likert" },
    { q: "ฉันสนใจการเขียนโปรแกรมให้คอมพิวเตอร์สามารถ เรียนรู้และตัดสินใจได้เอง (Machine Learning)", type: "likert" },
    { q: "ฉันสนใจเทคโนโลยีที่ทำให้คอมพิวเตอร์มองเห็นและแยกแยะวัตถุได้ (Computer Vision)", type: "likert" },
    { q: "ฉันสนใจเรื่องการประมวลผลภาษา (NLP) เช่น แชทบอท หรือ ระบบแปลภาษาอัตโนมัติ", type: "likert" },
    { q: "ฉันชอบการสร้างแบบจำลอง 3 มิติ หรือการพัฒนาเกมที่มีระบบฟิสิกส์ซับซ้อน", type: "likert" },
    {
        q: "เงินเดือนเริ่มต้นที่คาดหวัง (บาท)",
        type: "number",
        placeholder: "เช่น 25000",
        suffix: " บาท",
        min: 0
    },
    {
        q: "เกรดเฉลี่ยสะสมชั้นปี 1 ภาคเรียนที่ 1",
        type: "number",
        placeholder: "เช่น 3.50",
        min: 0, max: 4.0, step: 0.01
    },
    {
        q: "เกรดเฉลี่ยสะสมชั้นปี 1 ภาคเรียนที่ 2 (หากไม่มีให้กดปุ่มข้าม)",
        type: "number",
        placeholder: "เช่น 3.45",
        min: 0, max: 4.0, step: 0.01,
        skippable: true
    },
    {
        q: "เกรดเฉลี่ยสะสมชั้นปี 2 ภาคเรียนที่ 1 (หากไม่มีให้กดปุ่มข้าม)",
        type: "number",
        placeholder: "เช่น 3.60",
        min: 0, max: 4.0, step: 0.01,
        skippable: true
    },
    {
        q: "ระบุเพศของคุณ",
        type: "select",
        opts: [
            { t: "LGBTQ+", v: "lgbt" },
            { t: "ชาย", v: "male" },
            { t: "หญิง", v: "female" }
        ]
    }
];

const TRACKS = [
    {
        id: 'se', name: 'การพัฒนาซอฟต์แวร์ (Software Development)', color: 'var(--cyan)',
        fill: 'linear-gradient(90deg,#0ea5e9,#00e5ff)',
        tags: ['Web Dev', 'Mobile App', 'System Design', 'DevOps', 'Cloud'],
        desc: 'คุณชอบสร้างสิ่งที่จับต้องได้และมีผู้ใช้งานจริง มีความสามารถด้านการพัฒนาซอฟต์แวร์และ product thinking สายนี้จะพาคุณไปสู่การเป็น Full-Stack Developer หรือ Tech Lead ที่สามารถ deliver product ได้ตั้งแต่ต้นจนจบ',
        roadmap: 'Year 1-2: Programming, OOP, Database → Year 3: Web/Mobile, Agile, Cloud → Year 4: Senior Project, Internship'
    },
    {
        id: 'ds', name: 'ข้อมูลขนาดใหญ่และธุรกิจอัจฉริยะ (Big Data & Business Intelligence)', color: '#38bdf8',
        fill: 'linear-gradient(90deg,#0284c7,#38bdf8)',
        tags: ['Machine Learning', 'Python', 'Statistics', 'Data Viz', 'Big Data'],
        desc: 'คุณมีความสามารถในการมองหาแพทเทิร์นและวิเคราะห์ข้อมูล ชอบตั้งคำถามและหาคำตอบจากตัวเลข สายนี้จะพาคุณเป็น Data Scientist หรือ ML Engineer ที่สามารถเปลี่ยนข้อมูลดิบเป็น business insight ได้',
        roadmap: 'Year 1-2: Math, Stats, Python → Year 3: ML, Deep Learning, Visualization → Year 4: Research Project'
    },
    {
        id: 'is', name: 'ปัญญาประดิษฐ์และคอมพิวเตอร์วิทัศน์ (AI & Computer Vision)', color: '#818cf8',
        fill: 'linear-gradient(90deg,#4f46e5,#818cf8)',
        tags: ['AI/ML', 'Computer Vision', 'NLP', 'Robotics', 'Deep Learning'],
        desc: 'คุณมีความคิดสร้างสรรค์และชอบ challenge ที่ยาก ต้องการทำให้คอมพิวเตอร์ฉลาดขึ้น สายนี้เหมาะถ้าคุณอยากทำ research AI หรือสร้างระบบอัจฉริยะที่เปลี่ยนโลกได้',
        roadmap: 'Year 1-2: Math, Algorithm, Python → Year 3: AI, Computer Vision, NLP → Year 4: AI Research Project'
    },
    {
        id: 'ns', name: 'เทคโนโลยีอินเทอร์เน็ตและเครือข่าย (Network & Internet Technology)', color: '#34d399',
        fill: 'linear-gradient(90deg,#059669,#34d399)',
        tags: ['Cybersecurity', 'Network Admin', 'Cloud', 'Penetration Testing', 'Forensics'],
        desc: 'คุณมีทัศนคติแบบ Guardian ชอบปกป้องและวิเคราะห์ระบบ สายนี้จะพาคุณสู่การเป็น Security Engineer หรือ Network Architect ที่เป็นที่ต้องการอย่างมากในยุคดิจิทัล',
        roadmap: 'Year 1-2: Network, OS, Linux → Year 3: Security, Cryptography, Ethical Hacking → Year 4: Security Project'
    }
];

/* ══════════════════════════════
   STATE & REFS
══════════════════════════════ */
let step = 0, userResults = [];
const TOTAL = QUESTIONS.length;
document.getElementById("total-q").textContent = "/" + TOTAL;
const landing = document.getElementById('landing');
const quizMode = document.getElementById('quiz-mode');
const msgs = document.getElementById('messages');
const prog = document.getElementById('prog');
const sctr = document.getElementById('sctr');
const snum = document.getElementById('snum');
const txtInp = document.getElementById('txt-inp');
const sendBtn = document.querySelector('.send-btn');
const inpWrap = document.querySelector('.inp-wrap');

// Initialize AI
let aiInitialized = false;
async function initAI() {
    if (aiInitialized) return;
    const success = await PSU_AI.init('./');
    if (success) aiInitialized = true;
}

/* ══════════════════════════════
   START QUIZ
══════════════════════════════ */
document.querySelectorAll('.start-quiz-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        landing.classList.add('hidden');
        quizMode.classList.add('active');
        await initAI();
        showQ(0);
    });
});

/* ══════════════════════════════
   BACK TO LANDING
══════════════════════════════ */
document.getElementById('back-btn').addEventListener('click', () => {
    quizMode.classList.remove('active');
    landing.classList.remove('hidden');
    userResults = []; step = 0;
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

    // Reset input state
    txtInp.disabled = true;
    sendBtn.disabled = true;
    inpWrap.style.opacity = '.3';
    inpWrap.style.pointerEvents = 'none';

    showTyping(() => {
        let html = `<div class="stag">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      คำถาม ${idx + 1} / ${TOTAL}
    </div>
    <div style="margin-bottom:12px">${q.q}</div>`;

        if (q.type === "likert") {
            const labels = ["1", "2", "3", "4", "5"];
            const desc = ["ไม่จริงเลย", "", "", "", "จริงที่สุด"];
            html += `<div class="opts likert-row" id="opts-${idx}">`;
            labels.forEach((l, i) => {
                html += `<button class="opt likert-opt" onclick="pickLikert(${idx},${i + 1},this)">
                    <span class="olabel">${l}</span>
                    <span class="l-desc">${desc[i]}</span>
                </button>`;
            });
            html += `</div>`;
        } else if (q.type === "select") {
            html += `<div class="opts" id="opts-${idx}">`;
            q.opts.forEach((o, i) => {
                html += `<button class="opt" onclick="pickSelect(${idx},'${o.v}','${o.t}',this)">
                    <span class="olabel">${String.fromCharCode(65 + i)}</span><span>${o.t}</span>
                </button>`;
            });
            html += `</div>`;
        }

        if (q.skippable) {
            html += `<button class="skip-btn" onclick="pickNumber(${idx}, 0)">
                ข้ามขั้นตอนนี้ (ใส่เป็น 0)
            </button>`;
        }

        if (q.type === "number" || q.type === "text") {
            // Enable text input for numbers/text
            txtInp.disabled = false;
            txtInp.placeholder = q.placeholder || "พิมพ์ที่นี่...";
            txtInp.type = q.type;
            if (q.min !== undefined) txtInp.min = q.min;
            if (q.max !== undefined) txtInp.max = q.max;
            if (q.step !== undefined) txtInp.step = q.step;

            sendBtn.disabled = false;
            inpWrap.style.opacity = '1';
            inpWrap.style.pointerEvents = 'all';
            txtInp.focus();

            // Set up one-shot listener for enter/click
            const handleInput = () => {
                const val = parseFloat(txtInp.value);
                if (isNaN(val)) return;
                // Validation
                if (q.min !== undefined && val < q.min) return;
                if (q.max !== undefined && val > q.max) return;

                txtInp.value = "";
                pickNumber(idx, val);
                sendBtn.onclick = null;
                txtInp.onkeydown = null;
            };
            sendBtn.onclick = handleInput;
            txtInp.onkeydown = (e) => { if (e.key === 'Enter') handleInput(); };
        }

        addAI(html);
    });
}

/* ══════════════════════════════
   PICK OPTION
══════════════════════════════ */
function pickLikert(qIdx, val, btn) {
    document.querySelectorAll(`#opts-${qIdx} .opt`).forEach(b => b.classList.add('dead'));
    btn.classList.add('sel'); btn.classList.remove('dead');
    userResults[qIdx] = val;
    addUser(`คะแนน: ${val}`);
    nextStep(qIdx);
}

function pickSelect(qIdx, val, label, btn) {
    document.querySelectorAll(`#opts-${qIdx} .opt`).forEach(b => b.classList.add('dead'));
    btn.classList.add('sel'); btn.classList.remove('dead');
    userResults[qIdx] = val;
    addUser(label);
    nextStep(qIdx);
}

function pickNumber(qIdx, val) {
    userResults[qIdx] = val;
    addUser(`${val}${QUESTIONS[qIdx].suffix || ''}`);
    nextStep(qIdx);
}

function nextStep(qIdx) {
    setTimeout(() => {
        if (qIdx + 1 < TOTAL) showQ(qIdx + 1); else showResult();
    }, 450);
}

/* ══════════════════════════════
   SHOW RESULT
══════════════════════════════ */
async function showResult() {
    prog.style.width = '100%'; sctr.style.display = 'none';

    showTyping(async () => {
        // Prepare data for AI (31 features as requested by psu-ai.js)
        // Order based on guide: 20 likert, salary, gpa1, gpa2(skip), gpa3, gpa4, phantom1, phantom2, phantom3, gender_lgbt, gender_male, gender_female
        // Wait, the guide says 31 values. Let's map exactly.
        const inputData = [];
        for (let i = 0; i < 20; i++) inputData.push(userResults[i]); // 0-19: 20 Likert
        inputData.push(userResults[20] || 0); // 20: Salary
        inputData.push(userResults[21] || 0); // 21: GPA 1/1
        inputData.push(0); // 22: Column 27 (Phantom)
        inputData.push(userResults[22] || 0); // 23: GPA 1/2
        inputData.push(userResults[23] || 0); // 24: GPA 2/1
        inputData.push(0); // 25: Column 25 (Phantom)
        inputData.push(0); // 26: Column 25.1 (Phantom)
        inputData.push(0); // 27: Column 26 (Phantom)

        // Gender One-hot (28, 29, 30, 31)
        const gender = userResults[24];
        inputData.push(gender === 'lgbt' ? 1 : 0);    // 28
        inputData.push(gender === 'male' ? 1 : 0);    // 29
        inputData.push(gender === 'female' ? 1 : 0);  // 30
        inputData.push(0);                           // 31: ไม่ต้องการระบุเพศ

        console.log("AI Input Data:", inputData);
        let results = [];
        try {
            results = await PSU_AI.predict(inputData);
            console.log("AI Raw Predictions:", results);
        } catch (e) {
            console.error(e);
            // Fallback demo results if AI fails
            results = TRACKS.map(t => ({ track: t.name, percentage: 25 }));
        }

        // Map AI track names back to TRACKS objects for UI colors/icons
        const mappedResults = results.map(r => {
            // Use trim() and includes to be extra safe with track name matching
            const aiTrackName = r.track.trim();
            const track = TRACKS.find(t => aiTrackName.includes(t.name.trim()) || t.name.trim().includes(aiTrackName)) || TRACKS[0];
            return { ...track, pct: r.percentage, color: track.color || 'var(--cyan)' };
        });

        const top = mappedResults[0];

        let html = `<div class="stag" style="background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25);color:#34d399">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
      การวิเคราะห์เสร็จสิ้น ✦</div>
    <div style="margin-bottom:4px">วิเคราะห์คำตอบด้วยระบบ AI เสร็จแล้้ว! สายที่แนะนำให้คุณมากที่สุดคือ <strong style="color:${top.color}">${top.name}</strong></div>
    <div class="res-box"><div class="res-title">ผลการวิเคราะห์โดย AI</div>`;

        mappedResults.forEach((t, i) => {
            html += `<div class="rtrack"><div class="rrow">
        <span class="rname">${i === 0 ? '⭐ ' : i === 1 ? '✦ ' : ''}<strong style="color:${t.color}">${t.name}</strong></span>
        <span class="rpct" style="color:${t.color}">${t.pct}%</span></div>
        <div class="rbar"><div class="rfill" id="rf${i}" data-w="${t.pct}" style="background:${t.fill || t.color}"></div></div>
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
        setTimeout(() => { mappedResults.forEach((_, i) => { const el = document.getElementById('rf' + i); if (el) el.style.width = el.dataset.w + '%' }) }, 180);
    }, 1200);
}

function restartQuiz() { userResults = []; step = 0; msgs.innerHTML = ''; sctr.style.display = 'flex'; prog.style.width = '0%'; snum.textContent = '1'; showQ(0) }
function backToLanding() { quizMode.classList.remove('active'); landing.classList.remove('hidden'); userResults = []; step = 0; msgs.innerHTML = ''; prog.style.width = '0%'; snum.textContent = '1'; sctr.style.display = 'flex' }

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
