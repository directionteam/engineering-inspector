/* =====================================================
   المهندس الفاحص v4 - ULTIMATE EDITION
   (النسخة الكلاسيكية - بدون مستوى الخبير)
===================================================== */

/* ==================== الصعوبة ==================== */
const DIFFICULTIES = {
  easy:   { faults: 3, timePerFault: 15, wrongTools: 1, name: 'سهل' },
  medium: { faults: 5, timePerFault: 15, wrongTools: 2, name: 'متوسط' },
  hard:   { faults: 7, timePerFault: 15, wrongTools: 3, name: 'صعب' },
};

/* =====================================================
   الأعطال + التسلسل المنطقي
===================================================== */
const FAULTS = [
  {
    id: 'solar_crack',
    deviceName: 'SOLAR PANEL',
    title: 'خلية شمسية مكسورة',
    info: 'شرخ دقيق في الخلية رقم 7 يمنع توليد الطاقة.',
    fact: 'الشقوق الدقيقة تقلل كفاءة اللوحة بنسبة 10-30%.',
    tip: 'تجنّب الصدمات أثناء التركيب، وافحص اللوحة بعد أي عاصفة.',
    pos: { x: 18, y: 48 },
    targetZone: { x: 470, y: 265, w: 240, h: 200 },
    tools: [
      { id: 'cell',   name: 'خلية بديلة', icon: '🔋', correct: true },
      { id: 'screw',  name: 'مفك كهربائي', icon: '🔧', correct: false },
      { id: 'tape',   name: 'شريط لاصق',  icon: '📏', correct: false },
      { id: 'gloves', name: 'قفازات',     icon: '🧤', correct: false },
    ],
    next: ['cable_cut', 'missing_screw'],
    renderZoom: renderSolarCrack,
  },
  {
    id: 'cable_cut',
    deviceName: 'DC CABLE',
    title: 'كابل DC مقطوع',
    info: 'انقطاع في الكابل الأحمر بين اللوحة وصندوق التجميع.',
    fact: 'الكابلات DC تنقل تياراً عالياً. القطع يوقف الطاقة ويسبب شرارة.',
    tip: 'استخدم كابلات مقاومة UV، وافحص العزل سنوياً.',
    pos: { x: 33, y: 50 },
    targetZone: { x: 400, y: 180, w: 300, h: 220 },
    tools: [
      { id: 'cable',    name: 'كابل + لحام', icon: '🔌', correct: true },
      { id: 'tape',     name: 'شريط عازل',   icon: '📏', correct: false },
      { id: 'scissors', name: 'مقص',         icon: '✂️', correct: false },
      { id: 'gloves',   name: 'قفازات',      icon: '🧤', correct: false },
    ],
    next: ['fuse_blown', 'controller_fail'],
    renderZoom: renderCableCut,
  },
  {
    id: 'fuse_blown',
    deviceName: 'FUSE BOX',
    title: 'فيوز تالف',
    info: 'الفيوز الأوسط احترق بسبب ارتفاع التيار.',
    fact: 'الفيوز يحمي النظام من التيار الزائد.',
    tip: 'اختر فيوزاً بنفس الأمبير، ولا تستبدله بسلك أبداً.',
    pos: { x: 42, y: 48 },
    targetZone: { x: 400, y: 230, w: 240, h: 220 },
    tools: [
      { id: 'fuse',   name: 'فيوز 20A',   icon: '🛡️', correct: true },
      { id: 'fuse50', name: 'فيوز 50A',   icon: '⚡', correct: false },
      { id: 'wire',   name: 'سلك نحاسي',  icon: '➰', correct: false },
      { id: 'hammer', name: 'مطرقة',      icon: '🔨', correct: false },
    ],
    next: ['controller_fail', 'battery_low'],
    renderZoom: renderFuseBlown,
  },
  {
    id: 'controller_fail',
    deviceName: 'CHARGE CONTROLLER',
    title: 'منظم الشحن معطوب',
    info: 'الشاشة تعرض "ERROR E7".',
    fact: 'المنظم ينظّم جهد الشحن ويمنع الشحن الزائد.',
    tip: 'نظّف فتحات التبريد، وافحص الإعدادات كل 6 أشهر.',
    pos: { x: 58, y: 47 },
    targetZone: { x: 400, y: 190, w: 340, h: 220 },
    tools: [
      { id: 'reset',   name: 'إعادة تشغيل', icon: '🔄', correct: true },
      { id: 'wrench',  name: 'مفتاح ربط',   icon: '🔧', correct: false },
      { id: 'usb',     name: 'كابل USB',    icon: '🔌', correct: false },
      { id: 'blender', name: 'خلاط',        icon: '🥤', correct: false },
    ],
    next: ['battery_low', 'inverter_burn'],
    renderZoom: renderControllerFail,
  },
  {
    id: 'battery_low',
    deviceName: 'BATTERY PACK',
    title: 'خلية بطارية منتفخة',
    info: 'الخلية رقم 3 منتفخة ولا تحفظ الشحن.',
    fact: 'الخلية المنتفخة قد تتسبب في حريق إذا لم تُستبدل.',
    tip: 'لا تشحن البطارية في حرارة عالية.',
    pos: { x: 75, y: 46 },
    targetZone: { x: 360, y: 220, w: 280, h: 240 },
    tools: [
      { id: 'batteryCell', name: 'خلية بديلة', icon: '🔋', correct: true },
      { id: 'water',       name: 'ماء مقطر',   icon: '💧', correct: false },
      { id: 'charger',     name: 'شاحن سريع',  icon: '⚡', correct: false },
      { id: 'gauge',       name: 'مقياس ضغط',  icon: '📊', correct: false },
    ],
    next: ['inverter_burn'],
    renderZoom: renderBatteryLow,
  },
  {
    id: 'inverter_burn',
    deviceName: 'INVERTER',
    title: 'عاكس محروق',
    info: 'المكثفات سوداء ومتفحمة.',
    fact: 'العاكس يحوّل DC إلى AC. ارتفاع الحرارة يحرق المكثفات.',
    tip: 'وفّر تهوية جيدة، ولا تحمّله أكثر من طاقته.',
    pos: { x: 91, y: 48 },
    targetZone: { x: 400, y: 200, w: 420, h: 240 },
    tools: [
      { id: 'inverter', name: 'عاكس جديد', icon: '🔀', correct: true },
      { id: 'fan',      name: 'مروحة تبريد', icon: '🌀', correct: false },
      { id: 'water',    name: 'ماء',        icon: '💧', correct: false },
      { id: 'hammer',   name: 'مطرقة',      icon: '🔨', correct: false },
    ],
    next: ['missing_screw'],
    renderZoom: renderInverterBurn,
  },
  {
    id: 'missing_screw',
    deviceName: 'MOUNTING BRACKET',
    title: 'برغي ناقص في الحامل',
    info: 'البرغي رقم 4 مفقود.',
    fact: 'البرغي يحفظ استقرار اللوحة ضد الاهتزاز.',
    tip: 'افحص البراغي كل 3 أشهر.',
    pos: { x: 22, y: 55 },
    targetZone: { x: 540, y: 280, w: 220, h: 200 },
    tools: [
      { id: 'screwdriver', name: 'مفك + برغي', icon: '🔩', correct: true },
      { id: 'hammer',      name: 'مطرقة',      icon: '🔨', correct: false },
      { id: 'tape',        name: 'شريط لاصق',  icon: '📏', correct: false },
      { id: 'glue',        name: 'غراء',       icon: '🧴', correct: false },
    ],
    next: ['solar_crack'],
    renderZoom: renderMissingScrew,
  },
];

/* =====================================================
   رسومات الـ Zoom
===================================================== */
function renderSolarCrack() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zcellBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4a7fc4"/>
          <stop offset="100%" stop-color="#1e4a8a"/>
        </linearGradient>
      </defs>
      <g stroke="#5a9fe4" stroke-width="2">
        <rect x="50"  y="50"  width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect x="220" y="50"  width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect x="390" y="50"  width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect x="560" y="50"  width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect x="50"  y="200" width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect x="220" y="200" width="160" height="130" fill="url(#zcellBg)" rx="4"/>
        <rect id="brokenCell" x="390" y="200" width="160" height="130"
              fill="#3a1f1f" rx="4" stroke="#ff3b3b" stroke-width="3">
          <animate attributeName="fill" values="#3a1f1f;#5a1f1f;#3a1f1f" dur="1.4s" repeatCount="indefinite"/>
        </rect>
        <rect x="560" y="200" width="160" height="130" fill="url(#zcellBg)" rx="4"/>
      </g>
      <g stroke="#ff5757" stroke-width="2.5" fill="none" opacity="0.9">
        <path d="M 420 220 L 450 260 L 440 290 L 470 320">
          <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite"/>
        </path>
        <path d="M 460 210 L 490 250 L 480 290">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.1s" repeatCount="indefinite"/>
        </path>
      </g>
      <circle cx="470" cy="265" r="80" fill="rgba(255,59,59,0.15)">
        <animate attributeName="r" values="80;100;80" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
}

function renderCableCut() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <path d="M 50 180 Q 200 160, 350 180" stroke="#c0392b" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M 450 180 Q 600 160, 750 180" stroke="#c0392b" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g stroke="#ffd93d" stroke-width="3" fill="none">
        <path d="M 350 175 Q 400 165, 450 175">
          <animate attributeName="d" values="M 350 175 Q 400 165, 450 175;M 350 175 Q 400 185, 450 175;M 350 175 Q 400 165, 450 175" dur="0.8s" repeatCount="indefinite"/>
        </path>
      </g>
      <g fill="#ffe066">
        <circle cx="400" cy="175" r="4">
          <animate attributeName="r" values="4;10;4" dur="0.6s" repeatCount="indefinite"/>
        </circle>
      </g>
      <ellipse cx="400" cy="180" rx="120" ry="70" fill="rgba(255,59,59,0.2)">
        <animate attributeName="rx" values="120;140;120" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <path d="M 50 240 L 750 240" stroke="#2c3e50" stroke-width="14" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}

function renderFuseBlown() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="150" y="60" width="500" height="280" rx="16" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <g>
        <rect x="220" y="150" width="80" height="130" rx="8" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
        <rect x="250" y="150" width="20" height="130" fill="#00ff88" opacity="0.6"/>
      </g>
      <g>
        <rect x="360" y="150" width="80" height="130" rx="8"
              fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
          <animate attributeName="fill" values="#1a0a0a;#3a0a0a;#1a0a0a" dur="1s" repeatCount="indefinite"/>
        </rect>
        <circle cx="400" cy="315" r="6" fill="#ff3b3b">
          <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g>
        <rect x="500" y="150" width="80" height="130" rx="8" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
        <rect x="530" y="150" width="20" height="130" fill="#00ff88" opacity="0.6"/>
      </g>
    </svg>
  `;
}

function renderControllerFail() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="200" y="80" width="400" height="240" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <rect x="250" y="140" width="300" height="100" rx="8" fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
        <animate attributeName="fill" values="#1a0a0a;#3a0a0a;#1a0a0a" dur="1.2s" repeatCount="indefinite"/>
      </rect>
      <text x="400" y="185" text-anchor="middle" fill="#ff3b3b" font-size="30" font-family="monospace" font-weight="900">E7</text>
      <circle cx="320" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
      <circle cx="400" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
      <circle cx="480" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
    </svg>
  `;
}

function renderBatteryLow() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="100" y="60" width="600" height="280" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <g>
        <rect x="140" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <rect x="230" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <g id="swollenCell">
          <rect x="320" y="130" width="80" height="180" rx="8" fill="#5a1f1f" stroke="#ff3b3b" stroke-width="3">
            <animate attributeName="width" values="80;90;80" dur="1.5s" repeatCount="indefinite"/>
          </rect>
          <text x="360" y="230" text-anchor="middle" fill="#ff8b8b" font-size="24" font-family="monospace">⚠</text>
        </g>
        <rect x="410" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <rect x="500" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <rect x="590" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
      </g>
    </svg>
  `;
}

function renderInverterBurn() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="180" y="70" width="440" height="260" rx="20" fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
        <animate attributeName="stroke" values="#ff3b3b;#661414;#ff3b3b" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <g fill="#000" stroke="#4a2a2a" stroke-width="2">
        <rect x="220" y="150" width="60" height="60" rx="8"/>
        <rect x="300" y="150" width="60" height="60" rx="8"/>
        <rect x="380" y="150" width="60" height="60" rx="8"/>
        <rect x="460" y="150" width="60" height="60" rx="8"/>
        <rect x="540" y="150" width="60" height="60" rx="8"/>
      </g>
      <g fill="rgba(120,120,120,0.4)">
        <ellipse cx="280" cy="120" rx="30" ry="20">
          <animate attributeName="cy" values="120;40;120" dur="3s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="400" cy="130" rx="35" ry="22">
          <animate attributeName="cy" values="130;30;130" dur="3.5s" repeatCount="indefinite"/>
        </ellipse>
      </g>
    </svg>
  `;
}

function renderMissingScrew() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="100" y="100" width="600" height="40" fill="#4a7fc4" stroke="#2a5a8a" stroke-width="2"/>
      <rect x="100" y="260" width="600" height="40" fill="#4a7fc4" stroke="#2a5a8a" stroke-width="2"/>
      <rect x="380" y="100" width="40" height="200" fill="#4a7fc4" stroke="#2a5a8a" stroke-width="2"/>
      <g fill="#6a9fd4" stroke="#2a5a8a" stroke-width="2">
        <circle cx="160" cy="120" r="14"/>
        <circle cx="260" cy="120" r="14"/>
        <circle cx="360" cy="120" r="14"/>
        <circle cx="440" cy="120" r="14"/>
        <circle cx="540" cy="120" r="14"/>
        <circle cx="640" cy="120" r="14"/>
        <circle cx="160" cy="280" r="14"/>
        <circle cx="260" cy="280" r="14"/>
        <circle cx="360" cy="280" r="14"/>
        <circle cx="440" cy="280" r="14"/>
        <circle cx="640" cy="280" r="14"/>
      </g>
      <circle cx="540" cy="280" r="20" fill="none" stroke="#ff3b3b" stroke-width="3" stroke-dasharray="6,4">
        <animate attributeName="r" values="20;26;20" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
}

/* =====================================================
   حالة اللعبة
===================================================== */
const Game = {
  difficulty: 'medium',
  config: DIFFICULTIES.medium,
  running: false,
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: 45,
  totalFaults: 3,
  fixedFaults: 0,
  faultIndex: 0,

  currentFault: null,
  faultActive: false,
  faultDiagnosed: false,
  faultFixed: false,

  hoverStart: 0,
  hoverDuration: 1000,
  targetLocked: false,

  holdingTool: null,
  fingerActive: false,
  fingerX: 0,
  fingerY: 0,

  camera: null,
  hands: null,

  timerInterval: null,
  hintTimeout: null,

  toolbarVisible: false,
  usedFaults: [],
  lastFaultId: null,

  factBtnHoverStart: 0,
  timeWarnActive: false,

  bestScore: parseInt(localStorage.getItem('inspectorBestScoreV4') || '0', 10),
};

/* =====================================================
   عناصر DOM
===================================================== */
const el = {
  app: document.getElementById('app'),
  startScreen: document.getElementById('startScreen'),
  endScreen: document.getElementById('endScreen'),
  scene: document.getElementById('scene'),
  hud: document.getElementById('hud'),
  hintBar: document.getElementById('hintBar'),

  replayBtn: document.getElementById('replayBtn'),
  menuBtn: document.getElementById('menuBtn'),

  hudScore: document.getElementById('hudScore'),
  hudTime: document.getElementById('hudTime'),
  hudFaults: document.getElementById('hudFaults'),
  hudCombo: document.getElementById('hudCombo'),
  comboBox: document.getElementById('comboBox'),

  progressFill: document.getElementById('progressFill'),

  endTitle: document.getElementById('endTitle'),
  stars: document.getElementById('stars'),
  finalScore: document.getElementById('finalScore'),
  finalFixed: document.getElementById('finalFixed'),
  bestScore: document.getElementById('bestScore'),

  faultPoint: document.getElementById('faultPoint'),

  zoomView: document.getElementById('zoomView'),
  zoomCanvas: document.getElementById('zoomCanvas'),
  zoomDeviceName: document.getElementById('zoomDeviceName'),
  zoomInfoText: document.getElementById('zoomInfoText'),
  zoomCloseBtn: document.getElementById('zoomCloseBtn'),

  toolbar: document.getElementById('toolbar'),
  toolbarTools: document.getElementById('toolbarTools'),

  fingerCursor: document.getElementById('fingerCursor'),
  cursorProgress: document.getElementById('cursorProgress'),
  cursorTool: document.getElementById('cursorTool'),

  video: document.getElementById('video'),
  camCanvas: document.getElementById('camCanvas'),

  toast: document.getElementById('toast'),
  particles: document.getElementById('particles'),

  factCard: document.getElementById('factCard'),
  factDevice: document.getElementById('factDevice'),
  factTitle: document.getElementById('factTitle'),
  factText: document.getElementById('factText'),
  factTip: document.getElementById('factTip'),
  factContinueBtn: document.getElementById('factContinueBtn'),

  avatarBubble: document.getElementById('avatarBubble'),

  leaderboardScreen: document.getElementById('leaderboardScreen'),
  leaderboardList: document.getElementById('leaderboardList'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  startLeaderboardBtn: document.getElementById('startLeaderboardBtn'),
  showLeaderboardBtn: document.getElementById('showLeaderboardBtn'),
  saveScoreBtn: document.getElementById('saveScoreBtn'),
  playerName: document.getElementById('playerName'),
  nameInputWrapper: document.getElementById('nameInputWrapper'),
};

/* =====================================================
   الأصوات
===================================================== */
const Sound = {
  ctx: null,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { console.warn('Web Audio غير مدعوم'); }
  },

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

  noise(duration = 0.2, volume = 0.1, filterFreq = 2000) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(now);
  },

  ping() { this.tone(880, 0.08, 'sine', 0.06); },
  lock() { this.tone(1200, 0.1, 'square', 0.05); },
  tick() { this.tone(1500, 0.04, 'square', 0.07); },

  start() {
    [392, 523.25, 659.25].forEach((f, i) => this.tone(f, 0.35, 'sine', 0.13, i * 0.08));
  },
  end() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.14, i * 0.1));
  },
  diagnose() {
    this.tone(660, 0.15, 'sine', 0.1);
    this.tone(990, 0.15, 'sine', 0.1, 0.12);
  },

  factAppear() {
    this.tone(660, 0.2, 'sine', 0.1);
    this.tone(880, 0.25, 'sine', 0.1, 0.15);
  },

  faultSound(faultId) {
    switch (faultId) {
      case 'solar_crack':
        this.noise(0.15, 0.15, 4000);
        setTimeout(() => {
          this.tone(220, 0.3, 'sawtooth', 0.08);
          this.noise(0.4, 0.08, 1000);
        }, 150);
        break;
      case 'cable_cut':
        this.noise(0.5, 0.12, 3000);
        setTimeout(() => this.tone(440, 0.15, 'square', 0.06), 300);
        break;
      case 'fuse_blown':
        this.tone(1800, 0.05, 'square', 0.1);
        setTimeout(() => this.tone(1200, 0.15, 'sine', 0.12), 100);
        break;
      case 'controller_fail':
        [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.15, 'sine', 0.1, i * 0.1));
        break;
      case 'battery_low':
        this.noise(0.08, 0.15, 800);
        setTimeout(() => {
          this.tone(330, 0.4, 'sine', 0.1);
          this.tone(440, 0.5, 'sine', 0.08, 0.2);
        }, 100);
        break;
      case 'inverter_burn':
        this.noise(0.6, 0.08, 1500);
        setTimeout(() => this.tone(523, 0.3, 'sine', 0.1), 300);
        break;
      case 'missing_screw':
        this.tone(400, 0.05, 'square', 0.08);
        setTimeout(() => this.tone(600, 0.05, 'square', 0.08), 100);
        setTimeout(() => this.tone(800, 0.15, 'sine', 0.1), 200);
        break;
      default:
        this.tone(1000, 0.3, 'sine', 0.12);
    }
  },

  grabTool(toolId) {
    if (toolId === 'screwdriver' || toolId === 'wrench' || toolId === 'hammer') {
      this.tone(350, 0.06, 'square', 0.08);
    } else if (toolId === 'cable' || toolId === 'wire') {
      this.noise(0.1, 0.06, 3000);
    } else {
      this.tone(500, 0.08, 'sine', 0.08);
    }
  },

  wrongTool() {
    this.tone(200, 0.25, 'sawtooth', 0.12);
    this.tone(150, 0.3, 'sawtooth', 0.1, 0.05);
    this.noise(0.3, 0.08, 800);
  },
};

/* =====================================================
   الجزيئات
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

  burst(x, y, color = '#ffe066', count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.012 + Math.random() * 0
