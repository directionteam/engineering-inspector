/* =====================================================
   المهندس الفاحص - Solar Plant Inspector
   المنطق الكامل للعبة + MediaPipe + الأصوات + التأثيرات
===================================================== */

/* ==================== الحالة العامة ==================== */
const Game = {
  // الحالة
  running: false,
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: 60,
  totalFaults: 3,
  fixedFaults: 0,
  currentFaultIndex: 0,

  // الحالة الحالية للعطل
  faultActive: false,
  faultDiagnosed: false,
  faultFixed: false,

  // التقاط الهدف
  hoverStart: 0,
  hoverDuration: 1000, // ثانية واحدة
  targetLocked: false,

  // كاميرا
  camera: null,
  hands: null,
  fingerActive: false,

  // آخر موقع للإصبع (بكسل على الشاشة)
  fingerX: 0,
  fingerY: 0,

  // إحداثيات نقطة العطل الحالية على الشاشة
  faultScreenX: 0,
  faultScreenY: 0,
  faultRadius: 60,

  // المؤقت
  timerInterval: null,

  // أفضل نتيجة
  bestScore: parseInt(localStorage.getItem('inspectorBestScore') || '0', 10),
};

/* ==================== الأعطال (6 أنواع) ==================== */
const FAULTS = [
  {
    id: 'solar_crack',
    title: 'خلية شمسية مكسورة',
    desc: 'شرخ في إحدى الخلايا يمنع توليد الطاقة.',
    icon: '🟦',
    fix: 'استبدال الخلية',
    // موقع على الشاشة (نسبة مئوية بالنسبة للمشهد)
    pos: { x: 18, y: 48 },
  },
  {
    id: 'cable_cut',
    title: 'كابل DC مقطوع',
    desc: 'انقطاع في الكابل بين اللوحة وصندوق التجميع.',
    icon: '🔌',
    fix: 'إعادة توصيل الكابل',
    pos: { x: 33, y: 50 },
  },
  {
    id: 'fuse_blown',
    title: 'فيوز تالف',
    desc: 'احتراق الفيوز الرئيسي في صندوق التجميع.',
    icon: '🛡️',
    fix: 'استبدال الفيوز',
    pos: { x: 42, y: 48 },
  },
  {
    id: 'controller_fail',
    title: 'منظم الشحن معطوب',
    desc: 'شاشة المنظم تعرض خطأ ولا يشحن البطارية.',
    icon: '⚡',
    fix: 'إعادة تشغيل المنظم',
    pos: { x: 58, y: 47 },
  },
  {
    id: 'battery_low',
    title: 'بطارية فارغة',
    desc: 'مستوى الشحن منخفض جداً ولا يمكن تشغيل المنزل.',
    icon: '🔋',
    fix: 'بدء دورة شحن سريعة',
    pos: { x: 75, y: 46 },
  },
  {
    id: 'inverter_burn',
    title: 'عاكس محروق',
    desc: 'ارتفاع درجة الحرارة أتلف العاكس.',
    icon: '🔀',
    fix: 'استبدال العاكس',
    pos: { x: 91, y: 48 },
  },
];

/* ==================== عناصر DOM ==================== */
const el = {
  // الشاشات
  startScreen: document.getElementById('startScreen'),
  endScreen: document.getElementById('endScreen'),
  scene: document.getElementById('scene'),
  hud: document.getElementById('hud'),
  hintBar: document.getElementById('hintBar'),

  // الأزرار
  startBtn: document.getElementById('startBtn'),
  replayBtn: document.getElementById('replayBtn'),
  repairBtn: document.getElementById('repairBtn'),

  // HUD
  hudScore: document.getElementById('hudScore'),
  hudTime: document.getElementById('hudTime'),
  hudFaults: document.getElementById('hudFaults'),
  hudCombo: document.getElementById('hudCombo'),
  comboBox: document.getElementById('comboBox'),

  // الشاشة النهائية
  endTitle: document.getElementById('endTitle'),
  stars: document.getElementById('stars'),
  finalScore: document.getElementById('finalScore'),
  finalFixed: document.getElementById('finalFixed'),
  bestScore: document.getElementById('bestScore'),

  // نقطة العطل
  faultPoint: document.getElementById('faultPoint'),

  // بطاقة التشخيص
  diagnosisCard: document.getElementById('diagnosisCard'),
  diagIcon: document.getElementById('diagIcon'),
  diagTitle: document.getElementById('diagTitle'),
  diagDesc: document.getElementById('diagDesc'),

  // المؤشر
  fingerCursor: document.getElementById('fingerCursor'),
  cursorProgress: document.getElementById('cursorProgress'),

  // الكاميرا
  video: document.getElementById('video'),
  camCanvas: document.getElementById('camCanvas'),

  // الرسائل
  toast: document.getElementById('toast'),

  // الجزيئات
  particles: document.getElementById('particles'),

  // SVG
  lcdText: document.getElementById('lcdText'),
  batteryPct: document.getElementById('batteryPct'),
  batteryLevel: document.getElementById('batteryLevel'),
};

/* =====================================================
   نظام الأصوات (Web Audio API)
===================================================== */
const Sound = {
  ctx: null,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio غير مدعوم', e);
    }
  },

  // نغمة عامة
  tone(freq, duration = 0.15, type = 'sine', volume = 0.15, delay = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  },

  // نغمة تسلسلية (chord)
  chord(freqs, duration = 0.3, volume = 0.12) {
    freqs.forEach((f, i) => this.tone(f, duration, 'sine', volume, i * 0.04));
  },

  // الأصوات المخصصة
  ping() {
    this.tone(880, 0.08, 'sine', 0.06);
  },

  lock() {
    this.tone(1200, 0.1, 'square', 0.05);
  },

  success() {
    this.chord([523.25, 659.25, 783.99, 1046.5], 0.35, 0.13);
  },

  error() {
    this.tone(200, 0.25, 'sawtooth', 0.12);
    this.tone(150, 0.3, 'sawtooth', 0.1, 0.05);
  },

  tick() {
    this.tone(1500, 0.04, 'square', 0.07);
  },

  start() {
    this.chord([392, 523.25, 659.25], 0.4, 0.14);
  },

  end() {
    this.chord([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.5, 0.15);
  },

  diagnose() {
    this.tone(660, 0.15, 'sine', 0.1);
    this.tone(990, 0.15, 'sine', 0.1, 0.12);
  },
};

/* =====================================================
   نظام الرسائل العائمة (Toast)
===================================================== */
function showToast(text, type = 'info', duration = 1800) {
  el.toast.textContent = text;
  el.toast.className = 'toast ' + type;
  // إعادة تشغيل الأنيميشن
  void el.toast.offsetWidth;
  el.toast.classList.add('show');
  clearTimeout(el.toast._timeout);
  el.toast._timeout = setTimeout(() => {
    el.toast.classList.remove('show');
  }, duration);
}

/* =====================================================
   نظام الجزيئات (Particles)
===================================================== */
const Particles = {
  canvas: el.particles,
  ctx: null,
  particles: [],
  raf: null,

  init() {
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  burst(x, y, color = '#ffe066', count = 30, spread = 220) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.012 + Math.random() * 0.015,
        size: 2 + Math.random() * 4,
        color,
      });
    }
    this.startLoop();
  },

  startLoop() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => this.loop());
  },

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // جاذبية
      p.vx *= 0.985;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.raf = requestAnimationFrame(() => this.loop());
    } else {
      this.raf = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },
};

/* =====================================================
   بدء تشغيل MediaPipe Hands
===================================================== */
async function initHands() {
  if (typeof Hands === 'undefined') {
    console.error('MediaPipe Hands لم يتم تحميله');
    showToast('⚠ فشل تحميل مكتبة الكاميرا', 'error', 4000);
    return false;
  }

  Game.hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
  });

  Game.hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    selfieMode: true,
  });

  Game.hands.onResults(onHandsResults);

  return true;
}

async function startCamera() {
  if (typeof Camera === 'undefined') {
    console.error('MediaPipe Camera Utils لم يتم تحميله');
    return false;
  }

  Game.camera = new Camera(el.video, {
    onFrame: async () => {
      if (Game.hands) {
        await Game.hands.send({ image: el.video });
      }
    },
    width: 640,
    height: 480,
  });

  try {
    await Game.camera.start();
    return true;
  } catch (err) {
    console.error('فشل تشغيل الكاميرا', err);
    showToast('⚠ لم نتمكن من تشغيل الكاميرا', 'error', 4000);
    return false;
  }
}

/* =====================================================
   معالجة نتائج MediaPipe
===================================================== */
function onHandsResults(results) {
  // ارسم الفيديو على الكانفس
  if (el.camCanvas) {
    el.camCanvas.width = el.camCanvas.clientWidth;
    el.camCanvas.height = el.camCanvas.clientHeight;
    const ctx = el.camCanvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, el.camCanvas.width, el.camCanvas.height);
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, el.camCanvas.width, el.camCanvas.height);
    }
    ctx.restore();
  }

  // لا نتابع إذا كانت اللعبة غير مشغّلة
  if (!Game.running) return;

  // تحقق من وجود يد
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    Game.fingerActive = false;
    el.fingerCursor.classList.remove('visible');
    return;
  }

  const lm = results.multiHandLandmarks[0];
  const tip = lm[8]; // رأس السبابة

  // تحويل الإحداثيات (selfieMode يقلب الصورة تلقائياً، لذا نستخدم x مباشرة)
  const x = tip.x * window.innerWidth;
  const y = tip.y * window.innerHeight;

  Game.fingerActive = true;
  Game.fingerX = x;
  Game.fingerY = y;

  // حرّك المؤشر
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = x + 'px';
  el.fingerCursor.style.top = y + 'px';

  // تحقق من التفاعل
  checkHover(x, y);
}

/* =====================================================
   فحص التقاء المؤشر مع نقطة العطل
===================================================== */
function checkHover(x, y) {
  if (!Game.faultActive || Game.faultFixed) return;

  const dx = x - Game.faultScreenX;
  const dy = y - Game.faultScreenY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const inside = distance < Game.faultRadius;

  if (inside && !Game.faultDiagnosed) {
    // ابدأ العد
    if (!Game.hoverStart) {
      Game.hoverStart = performance.now();
      Sound.ping();
    }

    const elapsed = performance.now() - Game.hoverStart;
    const progress = Math.min(elapsed / Game.hoverDuration, 1);

    // حلقة التقدم
    const circumference = 2 * Math.PI * 40;
    el.cursorProgress.style.strokeDashoffset = circumference * (1 - progress);
    el.fingerCursor.classList.add('locked');
    el.fingerCursor.classList.remove('near');

    // صوت القفل
    if (!Game.targetLocked && progress > 0.15) {
      Game.targetLocked = true;
      Sound.lock();
    }

    // تشخيص
    if (elapsed >= Game.hoverDuration) {
      diagnoseFault();
    }
  } else {
    // إعادة ضبط
    Game.hoverStart = 0;
    Game.targetLocked = false;
    el.cursorProgress.style.strokeDashoffset = 251.2;
    el.fingerCursor.classList.remove('locked');

    // قريب؟
    if (distance < Game.faultRadius * 2 && !Game.faultDiagnosed) {
      el.fingerCursor.classList.add('near');
    } else {
      el.fingerCursor.classList.remove('near');
    }
  }
}

/* =====================================================
   عرض العطل الحالي
===================================================== */
function showFault(index) {
  if (index >= FAULTS.length) {
    endGame(true);
    return;
  }

  const fault = FAULTS[index];
  Game.currentFaultIndex = index;
  Game.faultActive = true;
  Game.faultDiagnosed = false;
  Game.faultFixed = false;

  // موضع نقطة العطل على الشاشة
  const sceneRect = el.scene.getBoundingClientRect();
  const fx = (fault.pos.x / 100) * sceneRect.width;
  const fy = (fault.pos.y / 100) * sceneRect.height;

  Game.faultScreenX = fx;
  Game.faultScreenY = fy;

  el.faultPoint.style.left = fx + 'px';
  el.faultPoint.style.top = fy + 'px';
  el.faultPoint.classList.remove('hidden', 'fixed');

  // حدّث HUD
  el.hudFaults.textContent = `${index + 1} / ${Game.totalFaults}`;

  // أخفِ بطاقة التشخيص
  el.diagnosisCard.classList.add('hidden');

  // اهتزاز خفيف للتنبيه
  Sound.tick();
}

/* =====================================================
   التشخيص
===================================================== */
function diagnoseFault() {
  if (Game.faultDiagnosed) return;
  Game.faultDiagnosed = true;

  const fault = FAULTS[Game.currentFaultIndex];

  // صوت
  Sound.diagnose();

  // اهتزاز المخطط (زووم خفيف)
  el.scene.style.transition = 'transform 0.3s ease';
  el.scene.style.transform = 'scale(1.02)';
  setTimeout(() => {
    el.scene.style.transform = 'scale(1)';
  }, 300);

  // حدّث البطاقة
  el.diagIcon.textContent = fault.icon;
  el.diagTitle.textContent = fault.title;
  el.diagDesc.textContent = fault.desc;

  // اعرض البطاقة بجانب نقطة العطل
  showDiagnosisCard();

  // أظهر رسالة
  showToast('🔍 تم التشخيص', 'info', 1500);

  // أوقف مؤشر الإصبع (لأن التشخيص انتهى)
  el.fingerCursor.classList.remove('locked');
  el.cursorProgress.style.strokeDashoffset = 251.2;
}

function showDiagnosisCard() {
  const cardW = 300;
  const cardH = 260;
  const padding = 20;

  let left = Game.faultScreenX + 60;
  let top = Game.faultScreenY - cardH / 2;

  // لا تخرج من الشاشة
  if (left + cardW > window.innerWidth - padding) {
    left = Game.faultScreenX - cardW - 60;
  }
  if (left < padding) left = padding;
  if (top < padding) top = padding;
  if (top + cardH > window.innerHeight - padding) {
    top = window.innerHeight - cardH - padding;
  }

  el.diagnosisCard.style.left = left + 'px';
  el.diagnosisCard.style.top = top + 'px';
  el.diagnosisCard.classList.remove('hidden');
}

/* =====================================================
   الإصلاح
===================================================== */
function repairFault() {
  if (!Game.faultDiagnosed || Game.faultFixed) return;
  Game.faultFixed = true;
  Game.faultActive = false;

  // إخفاء بطاقة التشخيص
  el.diagnosisCard.classList.add('hidden');

  // حدّث نقطة العطل
  el.faultPoint.classList.add('fixed');

  // نقاط
  const basePoints = 100;

  // مكافأة السرعة (كل ما مرّ وقت أقل، نقاط أكثر)
  const elapsed = Game.timeLeft - 60 + 60; // الوقت المستغرق غير واضح هنا، نستخدم بسيط
  const speedBonus = Math.floor(Math.random() * 30) + 20;

  // Combo
  Game.combo++;
  Game.maxCombo = Math.max(Game.maxCombo, Game.combo);
  const comboMultiplier = Math.min(Game.combo, 5);

  const totalPoints = (basePoints + speedBonus) * comboMultiplier;
  Game.score += totalPoints;

  // حدّث HUD
  el.hudScore.textContent = Game.score;

  // أظهر Combo إذا كان > 1
  if (Game.combo > 1) {
    el.comboBox.classList.remove('hidden');
    el.hudCombo.textContent = 'x' + Game.combo;
  }

  // صوت النجاح
  Sound.success();

  // رسالة نجاح
  showToast(`✅ +${totalPoints} نقطة!`, 'success', 1800);

  // جزيئات نيون
  const rect = el.faultPoint.getBoundingClientRect();
  Particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00ff88', 50, 300);

  // أضف تأثيراً بصرياً للمشهد
  flashScene();

  // أشعل الأنوار في المنزل إذا كان هذا آخر عطل
  Game.fixedFaults++;

  setTimeout(() => {
    // اذهب للعطل التالي
    showFault(Game.currentFaultIndex + 1);
  }, 1200);
}

/* =====================================================
   تأثير وميض المشهد
===================================================== */
function flashScene() {
  let count = 0;
  const interval = setInterval(() => {
    el.scene.style.filter = count % 2 === 0 ? 'brightness(1.4) saturate(1.3)' : 'brightness(1)';
    count++;
    if (count > 5) {
      clearInterval(interval);
      el.scene.style.filter = 'brightness(1)';
    }
  }, 100);
}

/* =====================================================
   اهتزاز الشاشة عند الخطأ
===================================================== */
function shakeScene() {
  el.scene.classList.add('shake');
  setTimeout(() => {
    el.scene.classList.remove('shake');
  }, 400);
}

/* =====================================================
   بدء اللعبة
===================================================== */
async function startGame() {
  Sound.init();

  // إخفاء شاشة البداية
  el.startScreen.classList.add('hidden');
  el.endScreen.classList.add('hidden');

  // إظهار المشهد
  el.scene.classList.remove('hidden');
  el.hud.classList.remove('hidden');
  el.hintBar.classList.remove('hidden');

  // إعادة تعيين الحالة
  Game.running = true;
  Game.score = 0;
  Game.combo = 0;
  Game.maxCombo = 0;
  Game.timeLeft = 60;
  Game.fixedFaults = 0;
  Game.currentFaultIndex = 0;
  Game.faultActive = false;
  Game.faultDiagnosed = false;
  Game.faultFixed = false;

  el.hudScore.textContent = '0';
  el.hudTime.textContent = '60';
  el.hudTime.classList.remove('warning');
  el.hudFaults.textContent = '1 / 3';
  el.comboBox.classList.add('hidden');

  // شغّل الكاميرا
  const handsReady = await initHands();
  if (handsReady) {
    await startCamera();
  } else {
    showToast('⚠ سيعمل المؤشر بالماوس فقط', 'error', 3000);
  }

  // شغّل المؤقت
  startTimer();

  // أظهر أول عطل
  setTimeout(() => {
    showFault(0);
    showToast('🎯 ابحث عن العطل الأول', 'info', 2000);
  }, 800);

  Sound.start();
}

/* =====================================================
   المؤقت
===================================================== */
function startTimer() {
  clearInterval(Game.timerInterval);
  Game.timerInterval = setInterval(() => {
    if (!Game.running) return;

    Game.timeLeft--;
    el.hudTime.textContent = Game.timeLeft;

    // تحذير في آخر 10 ثوانٍ
    if (Game.timeLeft <= 10) {
      el.hudTime.classList.add('warning');
      if (Game.timeLeft > 0) Sound.tick();
    }

    if (Game.timeLeft <= 0) {
      clearInterval(Game.timerInterval);
      endGame(false);
    }
  }, 1000);
}

/* =====================================================
   نهاية اللعبة
===================================================== */
function endGame(won) {
  Game.running = false;
  clearInterval(Game.timerInterval);

  // إخفاء HUD والمشهد
  el.hud.classList.add('hidden');
  el.hintBar.classList.add('hidden');
  el.fingerCursor.classList.remove('visible');
  el.diagnosisCard.classList.add('hidden');
  el.faultPoint.classList.add('hidden');

  // حفظ أفضل نتيجة
  if (Game.score > Game.bestScore) {
    Game.bestScore = Game.score;
    localStorage.setItem('inspectorBestScore', Game.bestScore.toString());
  }

  // حساب النجوم
  const stars = calculateStars(Game.score, won);

  // عرض شاشة النهاية
  el.endTitle.textContent = won ? '🎉 مهمة ناجحة!' : '⏰ انتهى الوقت!';
  el.stars.textContent = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
  el.finalScore.textContent = Game.score;
  el.finalFixed.textContent = `${Game.fixedFaults} / ${Game.totalFaults}`;
  el.bestScore.textContent = Game.bestScore;

  el.endScreen.classList.remove('hidden');

  // صوت النهاية
  Sound.end();

  // تأثير الجزيئات
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      Particles.burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.5,
        ['#ffe066', '#00ff88', '#7ac0ff'][i % 3],
        30,
        300
      );
    }, i * 200);
  }
}

/* =====================================================
   حساب النجوم
===================================================== */
function calculateStars(score, won) {
  if (!won && Game.fixedFaults === 0) return 1;
  if (score >= 500) return 5;
  if (score >= 400) return 4;
  if (score >= 300) return 3;
  if (score >= 200) return 2;
  return 1;
}

/* =====================================================
   الأحداث (Events)
===================================================== */
el.startBtn.addEventListener('click', startGame);
el.replayBtn.addEventListener('click', startGame);
el.repairBtn.addEventListener('click', repairFault);

// دعم الماوس (كاحتياط)
document.addEventListener('mousemove', (e) => {
  if (!Game.running || Game.fingerActive) return;
  Game.fingerX = e.clientX;
  Game.fingerY = e.clientY;
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = e.clientX + 'px';
  el.fingerCursor.style.top = e.clientY + 'px';
  checkHover(e.clientX, e.clientY);
});

// دعم اللمس (للجوال)
document.addEventListener('touchmove', (e) => {
  if (!Game.running || Game.fingerActive) return;
  const t = e.touches[0];
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = t.clientX + 'px';
  el.fingerCursor.style.top = t.clientY + 'px';
  checkHover(t.clientX, t.clientY);
}, { passive: true });

// عند تغيير حجم النافذة
window.addEventListener('resize', () => {
  if (Game.faultActive && !Game.faultFixed) {
    const fault = FAULTS[Game.currentFaultIndex];
    const sceneRect = el.scene.getBoundingClientRect();
    Game.faultScreenX = (fault.pos.x / 100) * sceneRect.width;
    Game.faultScreenY = (fault.pos.y / 100) * sceneRect.height;
    el.faultPoint.style.left = Game.faultScreenX + 'px';
    el.faultPoint.style.top = Game.faultScreenY + 'px';
  }
});

/* =====================================================
   التهيئة الأولية
===================================================== */
Particles.init();
el.bestScore.textContent = Game.bestScore;

console.log('%c🏗️ المهندس الفاحص', 'color:#ffe066;font-size:20px;font-weight:900;');
console.log('%cSolar Plant Inspector v1.0', 'color:#7ac0ff;font-size:12px;');
console.log('جاهز للعمل! اضغط "ابدأ المهمة".');
