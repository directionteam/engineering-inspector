/* =====================================================
   المهندس الفاحص v3 - FINAL EDITION
   كل التعديلات: كاميرا - بطاقة تعليمية - منع تكرار
===================================================== */

/* ==================== الصعوبة ==================== */
const DIFFICULTIES = {
  easy:   { faults: 3, timePerFault: 15, wrongTools: 1, name: 'سهل' },
  medium: { faults: 5, timePerFault: 15, wrongTools: 2, name: 'متوسط' },
  hard:   { faults: 7, timePerFault: 15, wrongTools: 3, name: 'صعب' },
};

/* =====================================================
   الأعطال (مع معلومة تعليمية)
===================================================== */
const FAULTS = [
  {
    id: 'solar_crack',
    deviceName: 'SOLAR PANEL',
    title: 'خلية شمسية مكسورة',
    info: 'شرخ دقيق في الخلية رقم 7 يمنع توليد الطاقة من هذه المنطقة.',
    fact: 'الشقوق الدقيقة تقلل كفاءة اللوحة بنسبة 10-30%. الخلية الواحدة التالفة تُعطّل السلسلة بأكملها.',
    tip: 'تجنّب الصدمات أثناء التركيب، وافحص اللوحة بعد أي عاصفة.',
    pos: { x: 18, y: 48 },
    targetZone: { x: 470, y: 265, w: 240, h: 200 },
    correctTool: 'cell',
    tools: [
      { id: 'cell',   name: 'خلية بديلة', icon: '🔋', correct: true },
      { id: 'screw',  name: 'مفك كهربائي', icon: '🔧', correct: false },
      { id: 'tape',   name: 'شريط لاصق',  icon: '📏', correct: false },
      { id: 'gloves', name: 'قفازات',     icon: '🧤', correct: false },
    ],
    renderZoom: renderSolarCrack,
  },
  {
    id: 'cable_cut',
    deviceName: 'DC CABLE',
    title: 'كابل DC مقطوع',
    info: 'انقطاع في الكابل الأحمر بين اللوحة وصندوق التجميع.',
    fact: 'الكابلات DC تنقل تياراً عالياً (10-20 أمبير). القطع يوقف نقل الطاقة فوراً ويسبب شرارة.',
    tip: 'استخدم كابلات مقاومة للأشعة UV، وافحص العزل سنوياً.',
    pos: { x: 33, y: 50 },
    targetZone: { x: 400, y: 180, w: 300, h: 220 },
    correctTool: 'cable',
    tools: [
      { id: 'cable',    name: 'كابل + لحام', icon: '🔌', correct: true },
      { id: 'tape',     name: 'شريط عازل',   icon: '📏', correct: false },
      { id: 'scissors', name: 'مقص',         icon: '✂️', correct: false },
      { id: 'gloves',   name: 'قفازات',      icon: '🧤', correct: false },
    ],
    renderZoom: renderCableCut,
  },
  {
    id: 'fuse_blown',
    deviceName: 'FUSE BOX',
    title: 'فيوز تالف',
    info: 'الفيوز الأوسط احترق بسبب ارتفاع التيار.',
    fact: 'الفيوز يحمي النظام من التيار الزائد. عند احتراقه، يقطع الدائرة لحماية باقي المكونات.',
    tip: 'اختر فيوزاً بنفس الأمبير الموصى به، ولا تستبدله بسلك أبداً.',
    pos: { x: 42, y: 48 },
    targetZone: { x: 400, y: 230, w: 240, h: 220 },
    correctTool: 'fuse',
    tools: [
      { id: 'fuse',   name: 'فيوز 20A',   icon: '🛡️', correct: true },
      { id: 'fuse50', name: 'فيوز 50A',   icon: '⚡', correct: false },
      { id: 'wire',   name: 'سلك نحاسي',  icon: '➰', correct: false },
      { id: 'hammer', name: 'مطرقة',      icon: '🔨', correct: false },
    ],
    renderZoom: renderFuseBlown,
  },
  {
    id: 'controller_fail',
    deviceName: 'CHARGE CONTROLLER',
    title: 'منظم الشحن معطوب',
    info: 'الشاشة تعرض "ERROR E7".',
    fact: 'المنظم ينظّم جهد الشحن من اللوحة إلى البطارية. يمنع الشحن الزائد الذي يتلف البطارية.',
    tip: 'نظّف فتحات التبريد، وافحص الإعدادات كل 6 أشهر.',
    pos: { x: 58, y: 47 },
    targetZone: { x: 400, y: 190, w: 340, h: 220 },
    correctTool: 'reset',
    tools: [
      { id: 'reset',   name: 'إعادة تشغيل', icon: '🔄', correct: true },
      { id: 'wrench',  name: 'مفتاح ربط',   icon: '🔧', correct: false },
      { id: 'usb',     name: 'كابل USB',    icon: '🔌', correct: false },
      { id: 'blender', name: 'خلاط',        icon: '🥤', correct: false },
    ],
    renderZoom: renderControllerFail,
  },
  {
    id: 'battery_low',
    deviceName: 'BATTERY PACK',
    title: 'خلية بطارية منتفخة',
    info: 'الخلية رقم 3 منتفخة ولا تحفظ الشحن.',
    fact: 'الخلية المنتفخة نتيجة تفاعلات كيميائية داخلية. قد تتسبب في حريق إذا لم تُستبدل.',
    tip: 'لا تشحن البطارية في حرارة عالية، وافحص الجهد بانتظام.',
    pos: { x: 75, y: 46 },
    targetZone: { x: 360, y: 220, w: 280, h: 240 },
    correctTool: 'batteryCell',
    tools: [
      { id: 'batteryCell', name: 'خلية بديلة', icon: '🔋', correct: true },
      { id: 'water',       name: 'ماء مقطر',   icon: '💧', correct: false },
      { id: 'charger',     name: 'شاحن سريع',  icon: '⚡', correct: false },
      { id: 'gauge',       name: 'مقياس ضغط',  icon: '📊', correct: false },
    ],
    renderZoom: renderBatteryLow,
  },
  {
    id: 'inverter_burn',
    deviceName: 'INVERTER',
    title: 'عاكس محروق',
    info: 'المكثفات سوداء ومتفحمة.',
    fact: 'العاكس يحوّل DC إلى AC بتردد 50/60 Hz. ارتفاع الحرارة يحرق المكثفات.',
    tip: 'وفّر تهوية جيدة، ولا تحمّله أكثر من طاقته.',
    pos: { x: 91, y: 48 },
    targetZone: { x: 400, y: 200, w: 420, h: 240 },
    correctTool: 'inverter',
    tools: [
      { id: 'inverter', name: 'عاكس جديد', icon: '🔀', correct: true },
      { id: 'fan',      name: 'مروحة تبريد', icon: '🌀', correct: false },
      { id: 'water',    name: 'ماء',        icon: '💧', correct: false },
      { id: 'hammer',   name: 'مطرقة',      icon: '🔨', correct: false },
    ],
    renderZoom: renderInverterBurn,
  },
  {
    id: 'missing_screw',
    deviceName: 'MOUNTING BRACKET',
    title: 'برغي ناقص في الحامل',
    info: 'البرغي رقم 4 مفقود.',
    fact: 'البراغي تحفظ استقرار اللوحة. نقصها يعرض اللوحة للاهتزاز والتلف عند الرياح.',
    tip: 'افحص البراغي كل 3 أشهر، خاصة بعد الرياح القوية.',
    pos: { x: 22, y: 55 },
    targetZone: { x: 540, y: 280, w: 220, h: 200 },
    correctTool: 'screwdriver',
    tools: [
      { id: 'screwdriver', name: 'مفك + برغي', icon: '🔩', correct: true },
      { id: 'hammer',      name: 'مطرقة',      icon: '🔨', correct: false },
      { id: 'tape',        name: 'شريط لاصق',  icon: '📏', correct: false },
      { id: 'glue',        name: 'غراء',       icon: '🧴', correct: false },
    ],
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
        <path d="M 500 230 L 530 270 L 520 310">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.3s" repeatCount="indefinite"/>
        </path>
      </g>
      <circle cx="470" cy="265" r="80" fill="rgba(255,59,59,0.15)">
        <animate attributeName="r" values="80;100;80" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x="470" y="360" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ CELL #7 CRACKED
      </text>
    </svg>
  `;
}

function renderCableCut() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <path d="M 50 180 Q 200 160, 350 180" stroke="#c0392b" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M 50 180 Q 200 160, 350 180" stroke="#ff5757" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M 450 180 Q 600 160, 750 180" stroke="#c0392b" stroke-width="22" fill="none" stroke-linecap="round"/>
      <g stroke="#ffd93d" stroke-width="3" fill="none">
        <path d="M 350 175 Q 400 165, 450 175">
          <animate attributeName="d" values="M 350 175 Q 400 165, 450 175;M 350 175 Q 400 185, 450 175;M 350 175 Q 400 165, 450 175" dur="0.8s" repeatCount="indefinite"/>
        </path>
        <path d="M 350 185 Q 400 195, 450 185">
          <animate attributeName="d" values="M 350 185 Q 400 195, 450 185;M 350 185 Q 400 175, 450 185;M 350 185 Q 400 195, 450 185" dur="0.9s" repeatCount="indefinite"/>
        </path>
      </g>
      <g fill="#ffe066">
        <circle cx="400" cy="175" r="4">
          <animate attributeName="r" values="4;10;4" dur="0.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="420" cy="190" r="3">
          <animate attributeName="r" values="3;8;3" dur="0.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      <ellipse cx="400" cy="180" rx="120" ry="70" fill="rgba(255,59,59,0.2)">
        <animate attributeName="rx" values="120;140;120" dur="1.5s" repeatCount="indefinite"/>
      </ellipse>
      <path d="M 50 240 L 750 240" stroke="#2c3e50" stroke-width="14" fill="none" stroke-linecap="round"/>
      <text x="400" y="330" text-anchor="middle" fill="#ff5757" font-size="18" font-family="monospace">
        ⚠ CABLE DISCONNECTED
      </text>
    </svg>
  `;
}

function renderFuseBlown() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="150" y="60" width="500" height="280" rx="16" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <text x="400" y="100" text-anchor="middle" fill="#7ac0ff" font-size="18" font-family="monospace">FUSE BOX</text>
      <g>
        <rect x="220" y="150" width="80" height="130" rx="8" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
        <rect x="250" y="150" width="20" height="130" fill="#00ff88" opacity="0.6"/>
        <circle cx="260" cy="315" r="6" fill="#00ff88"/>
      </g>
      <g>
        <rect id="blownFuse" x="360" y="150" width="80" height="130" rx="8"
              fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
          <animate attributeName="fill" values="#1a0a0a;#3a0a0a;#1a0a0a" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="390" y="150" width="20" height="130" fill="#000"/>
        <circle cx="400" cy="315" r="6" fill="#ff3b3b">
          <animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/>
        </circle>
        <g fill="#ffe066">
          <circle cx="380" cy="200" r="3">
            <animate attributeName="cy" values="200;170;200" dur="0.7s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite"/>
          </circle>
          <circle cx="420" cy="220" r="2">
            <animate attributeName="cy" values="220;190;220" dur="0.9s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite"/>
          </circle>
        </g>
      </g>
      <g>
        <rect x="500" y="150" width="80" height="130" rx="8" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
        <rect x="530" y="150" width="20" height="130" fill="#00ff88" opacity="0.6"/>
        <circle cx="540" cy="315" r="6" fill="#00ff88"/>
      </g>
      <polygon points="400,50 380,20 420,20" fill="#ff5757">
        <animate attributeName="points" values="400,50 380,20 420,20;400,60 380,30 420,30;400,50 380,20 420,20" dur="1s" repeatCount="indefinite"/>
      </polygon>
      <text x="400" y="380" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ FUSE #2 BLOWN
      </text>
    </svg>
  `;
}

function renderControllerFail() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="200" y="80" width="400" height="240" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <text x="400" y="120" text-anchor="middle" fill="#7ac0ff" font-size="16" font-family="monospace">CHARGE CONTROLLER</text>
      <rect x="250" y="140" width="300" height="100" rx="8" fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
        <animate attributeName="fill" values="#1a0a0a;#3a0a0a;#1a0a0a" dur="1.2s" repeatCount="indefinite"/>
      </rect>
      <text x="400" y="180" text-anchor="middle" fill="#ff3b3b" font-size="26" font-family="monospace" font-weight="900">ERROR</text>
      <text x="400" y="215" text-anchor="middle" fill="#ff3b3b" font-size="22" font-family="monospace">E7</text>
      <circle cx="320" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
      <circle cx="400" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
      <circle cx="480" cy="280" r="14" fill="#2a5a8a" stroke="#6a9fd4" stroke-width="2"/>
      <circle cx="400" cy="190" r="150" fill="rgba(255,59,59,0.1)">
        <animate attributeName="r" values="150;180;150" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="400" y="380" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ SYSTEM ERROR — RESET NEEDED
      </text>
    </svg>
  `;
}

function renderBatteryLow() {
  return `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="100" y="60" width="600" height="280" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <text x="400" y="100" text-anchor="middle" fill="#7ac0ff" font-size="16" font-family="monospace">BATTERY PACK — CROSS SECTION</text>
      <g>
        <rect x="140" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <text x="180" y="230" text-anchor="middle" fill="#001526" font-size="20" font-family="monospace" font-weight="900">1</text>
        <rect x="230" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <text x="270" y="230" text-anchor="middle" fill="#001526" font-size="20" font-family="monospace" font-weight="900">2</text>
        <g id="swollenCell">
          <rect x="320" y="130" width="80" height="180" rx="8" fill="#5a1f1f" stroke="#ff3b3b" stroke-width="3">
            <animate attributeName="width" values="80;90;80" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="x" values="320;315;320" dur="1.5s" repeatCount="indefinite"/>
          </rect>
          <text x="360" y="230" text-anchor="middle" fill="#ff8b8b" font-size="24" font-family="monospace" font-weight="900">⚠</text>
          <text x="360" y="260" text-anchor="middle" fill="#ff5757" font-size="11" font-family="monospace">SWOLLEN</text>
        </g>
        <rect x="410" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <text x="450" y="230" text-anchor="middle" fill="#001526" font-size="20" font-family="monospace" font-weight="900">4</text>
        <rect x="500" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <text x="540" y="230" text-anchor="middle" fill="#001526" font-size="20" font-family="monospace" font-weight="900">5</text>
        <rect x="590" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
        <text x="630" y="230" text-anchor="middle" fill="#001526" font-size="20" font-family="monospace" font-weight="900">6</text>
      </g>
      <polygon points="360,80 340,55 380,55" fill="#ff5757">
        <animate attributeName="points" values="360,80 340,55 380,55;360,90 340,65 380,65;360,80 340,55 380,55" dur="1s" repeatCount="indefinite"/>
      </polygon>
      <text x="400" y="380" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ CELL #3 DAMAGED
      </text>
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
      <text x="400" y="110" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">INVERTER — BURNT</text>
      <g fill="#000" stroke="#4a2a2a" stroke-width="2">
        <rect x="220" y="150" width="60" height="60" rx="8"/>
        <rect x="300" y="150" width="60" height="60" rx="8"/>
        <rect x="380" y="150" width="60" height="60" rx="8"/>
        <rect x="460" y="150" width="60" height="60" rx="8"/>
        <rect x="540" y="150" width="60" height="60" rx="8"/>
      </g>
      <g fill="rgba(100,100,100,0.4)">
        <ellipse cx="280" cy="120" rx="30" ry="20">
          <animate attributeName="cy" values="120;40;120" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="400" cy="130" rx="35" ry="22">
          <animate attributeName="cy" values="130;30;130" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0;0.7" dur="3.5s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="520" cy="120" rx="30" ry="20">
          <animate attributeName="cy" values="120;40;120" dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite"/>
        </ellipse>
      </g>
      <g fill="#ffe066">
        <circle cx="250" cy="180" r="3">
          <animate attributeName="r" values="3;8;3" dur="0.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="500" cy="200" r="3">
          <animate attributeName="r" values="3;8;3" dur="0.7s" repeatCount="indefinite"/>
        </circle>
      </g>
      <line x1="220" y1="300" x2="580" y2="300" stroke="#661414" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="400" y="380" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ INVERTER DESTROYED
      </text>
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
      <g id="emptyHole">
        <circle cx="540" cy="280" r="20" fill="none" stroke="#ff3b3b" stroke-width="3" stroke-dasharray="6,4">
          <animate attributeName="r" values="20;26;20" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="540" cy="280" r="10" fill="#1a0a0a"/>
      </g>
      <polygon points="540,240 520,200 560,200" fill="#ff5757">
        <animate attributeName="points" values="540,240 520,200 560,200;540,250 520,210 560,210;540,240 520,200 560,200" dur="1s" repeatCount="indefinite"/>
      </polygon>
      <text x="400" y="370" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ SCREW MISSING AT POSITION 4
      </text>
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

  factBtnHoverStart: 0,

  bestScore: parseInt(localStorage.getItem('inspectorBestScoreV3') || '0', 10),
};

/* =====================================================
   عناصر DOM
===================================================== */
const el = {
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
};

/* =====================================================
   نظام الأصوات
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

  factAppear() {
    this.tone(660, 0.2, 'sine', 0.1);
    this.tone(880, 0.25, 'sine', 0.1, 0.15);
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
      p.vy += 0.12;
      p.vx *= 0.985;
      p.life -= p.decay;

      if (p.life <= 0) { this.particles.splice(i, 1); continue; }

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

    if (this.particles.length > 0) this.raf = requestAnimationFrame(() => this.loop());
    else { this.raf = null; this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  },
};

/* =====================================================
   Toast
===================================================== */
function showToast(text, type = 'info', duration = 1800) {
  el.toast.textContent = text;
  el.toast.className = 'toast ' + type;
  void el.toast.offsetWidth;
  el.toast.classList.add('show');
  clearTimeout(el.toast._timeout);
  el.toast._timeout = setTimeout(() => el.toast.classList.remove('show'), duration);
}

/* =====================================================
   اختيار الصعوبة
===================================================== */
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    Game.difficulty = btn.dataset.diff;
    Game.config = DIFFICULTIES[Game.difficulty];
    setTimeout(startGame, 300);
  });
});

/* =====================================================
   بدء اللعبة
===================================================== */
async function startGame() {
  Sound.init();

  el.startScreen.classList.add('hidden');
  el.endScreen.classList.add('hidden');
  el.scene.classList.remove('hidden');
  el.hud.classList.remove('hidden');
  el.hintBar.classList.remove('hidden');

  Game.running = true;
  Game.score = 0;
  Game.combo = 0;
  Game.maxCombo = 0;
  Game.totalFaults = Game.config.faults;
  Game.timeLeft = Game.config.faults * Game.config.timePerFault;
  Game.fixedFaults = 0;
  Game.faultIndex = 0;
  Game.faultActive = false;
  Game.faultDiagnosed = false;
  Game.faultFixed = false;
  Game.holdingTool = null;
  Game.toolbarVisible = false;
  Game.usedFaults = [];
  Game.factBtnHoverStart = 0;

  el.hudScore.textContent = '0';
  el.hudTime.textContent = Game.timeLeft;
  el.hudTime.classList.remove('warning');
  el.hudFaults.textContent = `1 / ${Game.totalFaults}`;
  el.comboBox.classList.add('hidden');
  el.cursorTool.textContent = '';
  el.factCard.classList.add('hidden');
  el.factCard.classList.remove('active');

  const handsReady = await initHands();
  if (handsReady) await startCamera();

  startTimer();

  setTimeout(() => {
    showFault(0);
    showToast('🎯 ابحث عن العطل الأول', 'info', 2200);
  }, 700);

  Sound.start();
}

/* =====================================================
   عرض العطل (مع منع التكرار)
===================================================== */
function showFault(index) {
  if (index >= Game.totalFaults) { endGame(true); return; }

  // اختر عطلاً لم يُستخدم بعد
  let availableFaults = FAULTS.filter(f => !Game.usedFaults.includes(f.id));

  if (availableFaults.length === 0) {
    Game.usedFaults = [];
    availableFaults = FAULTS.slice();
  }

  const chosen = availableFaults[Math.floor(Math.random() * availableFaults.length)];
  Game.usedFaults.push(chosen.id);

  Game.faultIndex = index;
  Game.currentFault = chosen;
  Game.faultActive = true;
  Game.faultDiagnosed = false;
  Game.faultFixed = false;

  const sceneRect = el.scene.getBoundingClientRect();
  const fx = (chosen.pos.x / 100) * sceneRect.width;
  const fy = (chosen.pos.y / 100) * sceneRect.height;

  el.faultPoint.style.left = fx + 'px';
  el.faultPoint.style.top = fy + 'px';
  el.faultPoint.classList.remove('hidden', 'fixed');

  el.hudFaults.textContent = `${index + 1} / ${Game.totalFaults}`;

  Game.faultScreenX = fx;
  Game.faultScreenY = fy;

  Sound.tick();

  clearTimeout(Game.hintTimeout);
  Game.hintTimeout = setTimeout(() => {
    if (!Game.faultDiagnosed) {
      showToast('💡 قرّب إصبعك أكثر من النقطة الحمراء', 'info', 3000);
    }
  }, 15000);
}

/* =====================================================
   فحص Hover على العطل
===================================================== */
function checkHover(x, y) {
  if (!Game.faultActive || Game.faultFixed || Game.faultDiagnosed) return;

  const dx = x - Game.faultScreenX;
  const dy = y - Game.faultScreenY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const inside = dist < 80;

  if (inside) {
    if (!Game.hoverStart) {
      Game.hoverStart = performance.now();
      Sound.ping();
    }
    const elapsed = performance.now() - Game.hoverStart;
    const progress = Math.min(elapsed / Game.hoverDuration, 1);
    const circumference = 2 * Math.PI * 40;
    el.cursorProgress.style.strokeDashoffset = circumference * (1 - progress);
    el.fingerCursor.classList.add('locked');

    if (!Game.targetLocked && progress > 0.15) {
      Game.targetLocked = true;
      Sound.lock();
    }

    if (elapsed >= Game.hoverDuration) diagnoseFault();
  } else {
    Game.hoverStart = 0;
    Game.targetLocked = false;
    el.cursorProgress.style.strokeDashoffset = 251.2;
    el.fingerCursor.classList.remove('locked');
  }
}

/* =====================================================
   التشخيص
===================================================== */
function diagnoseFault() {
  if (Game.faultDiagnosed) return;
  Game.faultDiagnosed = true;
  Game.faultActive = false;

  Sound.diagnose();
  clearTimeout(Game.hintTimeout);

  el.cursorProgress.style.strokeDashoffset = 251.2;
  el.fingerCursor.classList.remove('locked');

  const fault = Game.currentFault;

  el.zoomDeviceName.textContent = fault.deviceName;
  el.zoomCanvas.innerHTML = fault.renderZoom();
  el.zoomInfoText.textContent = fault.info;

  el.zoomView.classList.remove('hidden');
  setTimeout(() => el.zoomView.classList.add('active'), 30);

  prepareToolbar(fault);

  el.toolbar.classList.remove('hidden');
  Game.toolbarVisible = true;

  el.hintBar.innerHTML = '🖐️ مرّر إصبعك فوق الأداة الصحيحة (ابقَ عليها لحظة)';

  showToast('🔍 تم التشخيص — اختر الأداة', 'info', 2000);
}

/* =====================================================
   تجهيز شريط الأدوات
===================================================== */
function prepareToolbar(fault) {
  el.toolbarTools.innerHTML = '';
  el.cursorTool.textContent = '';

  const correct = fault.tools.find(t => t.correct);
  const wrongs = fault.tools.filter(t => !t.correct);
  const numWrong = Game.config.wrongTools;
  const shuffledWrongs = wrongs.sort(() => Math.random() - 0.5).slice(0, numWrong);
  const toolsToShow = [correct, ...shuffledWrongs].sort(() => Math.random() - 0.5);

  toolsToShow.forEach(tool => {
    const btn = document.createElement('div');
    btn.className = 'tool-item';
    btn.dataset.toolId = tool.id;
    btn.dataset.correct = tool.correct ? '1' : '0';
    btn.innerHTML = `
      <span class="tool-icon">${tool.icon}</span>
      <span class="tool-name">${tool.name}</span>
    `;

    btn.addEventListener('mousedown', (e) => {
      if (Game.faultFixed) return;
      e.preventDefault();
      pickTool(tool, btn);
    });

    btn.addEventListener('touchstart', (e) => {
      if (Game.faultFixed) return;
      e.preventDefault();
      pickTool(tool, btn);
    }, { passive: false });

    el.toolbarTools.appendChild(btn);
  });
}

/* =====================================================
   اختيار الأداة
===================================================== */
function pickTool(tool, btnEl) {
  if (Game.faultFixed || Game.holdingTool) return;

  Game.holdingTool = tool;
  el.cursorTool.textContent = tool.icon;
  el.fingerCursor.classList.add('holding');
  btnEl.classList.add('picked');

  Sound.grabTool(tool.id);
  showToast(`✋ أمسكت: ${tool.name}`, 'info', 1200);
}

/* =====================================================
   اختيار الأداة بالإصبع (hover 400ms)
===================================================== */
let toolHoverTimer = null;
let toolHoverTarget = null;

function checkToolHover(x, y) {
  if (Game.holdingTool) return;

  const buttons = el.toolbarTools.querySelectorAll('.tool-item');
  let hoveredBtn = null;

  buttons.forEach(btn => {
    if (btn.classList.contains('picked')) return;
    const r = btn.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      hoveredBtn = btn;
    }
  });

  if (hoveredBtn !== toolHoverTarget) {
    clearTimeout(toolHoverTimer);
    toolHoverTarget = hoveredBtn;

    buttons.forEach(b => {
      b.style.transform = '';
      b.style.borderColor = '';
      b.style.boxShadow = '';
    });

    if (hoveredBtn) {
      hoveredBtn.style.transform = 'translateY(-6px) scale(1.05)';
      hoveredBtn.style.borderColor = '#ffe066';
      hoveredBtn.style.boxShadow = '0 0 25px rgba(255,217,61,0.7)';

      toolHoverTimer = setTimeout(() => {
        if (toolHoverTarget === hoveredBtn && !Game.holdingTool) {
          const toolId = hoveredBtn.dataset.toolId;
          const tool = Game.currentFault.tools.find(t => t.id === toolId);
          if (tool) {
            pickTool(tool, hoveredBtn);
            hoveredBtn.style.transform = '';
            hoveredBtn.style.borderColor = '';
            hoveredBtn.style.boxShadow = '';
          }
        }
      }, 400);
    }
  }
}

/* =====================================================
   إفلات الأداة (600ms في منطقة العطل)
===================================================== */
let dropTimer = null;

function checkDropWithDelay(x, y) {
  const zoomRect = el.zoomCanvas.getBoundingClientRect();
  const insideZoom =
    x >= zoomRect.left && x <= zoomRect.right &&
    y >= zoomRect.top && y <= zoomRect.bottom;

  if (!insideZoom) {
    clearTimeout(dropTimer);
    dropTimer = null;
    return;
  }

  const vbX = ((x - zoomRect.left) / zoomRect.width) * 800;
  const vbY = ((y - zoomRect.top) / zoomRect.height) * 400;

  const zone = Game.currentFault.targetZone;
  const inZone =
    vbX >= zone.x - zone.w / 2 && vbX <= zone.x + zone.w / 2 &&
    vbY >= zone.y - zone.h / 2 && vbY <= zone.y + zone.h / 2;

  if (inZone && !dropTimer) {
    dropTimer = setTimeout(() => {
      if (Game.holdingTool) tryDropTool(x, y);
      dropTimer = null;
    }, 600);
  } else if (!inZone) {
    clearTimeout(dropTimer);
    dropTimer = null;
  }
}

/* =====================================================
   محاولة إفلات الأداة
===================================================== */
function tryDropTool(x, y) {
  if (!Game.holdingTool || Game.faultFixed) return;

  const zoomRect = el.zoomCanvas.getBoundingClientRect();
  const insideZoom =
    x >= zoomRect.left && x <= zoomRect.right &&
    y >= zoomRect.top && y <= zoomRect.bottom;

  if (!insideZoom) return;

  const vbX = ((x - zoomRect.left) / zoomRect.width) * 800;
  const vbY = ((y - zoomRect.top) / zoomRect.height) * 400;

  const zone = Game.currentFault.targetZone;
  const inZone =
    vbX >= zone.x - zone.w / 2 && vbX <= zone.x + zone.w / 2 &&
    vbY >= zone.y - zone.h / 2 && vbY <= zone.y + zone.h / 2;

  const tool = Game.holdingTool;
  const toolEl = el.toolbarTools.querySelector(`[data-tool-id="${tool.id}"]`);

  if (tool.correct && inZone) {
    applyRepair(x, y);
  } else if (!tool.correct && inZone) {
    wrongToolAttempt(toolEl);
  } else {
    showToast('❌ أفلت الأداة فوق الجزء المعطوب', 'error', 1500);
    releaseTool();
  }
}

function wrongToolAttempt(toolEl) {
  Sound.wrongTool();
  shakeScene();
  showToast('❌ أداة خاطئة! قد تسبب ضرراً', 'error', 1800);

  if (toolEl) toolEl.classList.add('wrong-pick');
  setTimeout(() => {
    if (toolEl) toolEl.classList.remove('wrong-pick');
  }, 500);

  Game.score = Math.max(0, Game.score - 20);
  el.hudScore.textContent = Game.score;

  releaseTool();
}

function releaseTool() {
  if (!Game.holdingTool) return;
  const toolEl = el.toolbarTools.querySelector(`[data-tool-id="${Game.holdingTool.id}"]`);
  if (toolEl) toolEl.classList.remove('picked');
  Game.holdingTool = null;
  el.cursorTool.textContent = '';
  el.fingerCursor.classList.remove('holding');

  clearTimeout(toolHoverTimer);
  toolHoverTarget = null;
  el.toolbarTools.querySelectorAll('.tool-item').forEach(b => {
    b.style.transform = '';
    b.style.borderColor = '';
    b.style.boxShadow = '';
  });
}

/* =====================================================
   تطبيق الإصلاح
===================================================== */
function applyRepair(x, y) {
  Game.faultFixed = true;
  Game.toolbarVisible = false;
  const fault = Game.currentFault;

  Sound.faultSound(fault.id);
  Particles.burst(x, y, '#00ff88', 60);

  const base = 100;
  const speedBonus = Math.floor(Math.random() * 30) + 20;
  Game.combo++;
  Game.maxCombo = Math.max(Game.maxCombo, Game.combo);
  const multiplier = Math.min(Game.combo, 5);
  const total = (base + speedBonus) * multiplier;
  Game.score += total;
  el.hudScore.textContent = Game.score;

  if (Game.combo > 1) {
    el.comboBox.classList.remove('hidden');
    el.hudCombo.textContent = 'x' + Game.combo;
  }

  showToast(`✅ +${total} نقطة!`, 'success', 1800);

  releaseTool();
  flashZoom();
  Game.fixedFaults++;

  setTimeout(() => {
    el.zoomView.classList.remove('active');
    setTimeout(() => {
      el.zoomView.classList.add('hidden');
      el.toolbar.classList.add('hidden');
      el.faultPoint.classList.add('fixed');
      el.hintBar.innerHTML = '👉 حرّك إصبع السبابة نحو <span style="color:#ff5757">نقطة العطل</span> وابقَ عليها ثانية';

      document.querySelectorAll('.window-light').forEach(w => w.classList.add('on'));

      // 📚 اعرض البطاقة التعليمية
      showFactCard(fault);
    }, 350);
  }, 900);
}

function flashZoom() {
  let count = 0;
  const iv = setInterval(() => {
    el.zoomCanvas.style.filter = count % 2 === 0 ? 'brightness(1.5)' : 'brightness(1)';
    count++;
    if (count > 5) {
      clearInterval(iv);
      el.zoomCanvas.style.filter = 'brightness(1)';
    }
  }, 100);
}

function shakeScene() {
  el.scene.classList.add('shake');
  setTimeout(() => el.scene.classList.remove('shake'), 400);
}

/* =====================================================
   بطاقة المعلومة التعليمية
===================================================== */
function showFactCard(fault) {
  // ⏸️ أوقف المؤقت
  clearInterval(Game.timerInterval);
  Game.timerInterval = null;

  el.factDevice.textContent = fault.deviceName;
  el.factTitle.textContent = fault.title;
  el.factText.textContent = fault.fact || 'لم تُضف معلومة بعد.';
  el.factTip.textContent = fault.tip || 'لم تُضف نصيحة بعد.';

  el.factCard.classList.remove('hidden');
  setTimeout(() => el.factCard.classList.add('active'), 30);

  Sound.factAppear();
  Game.factBtnHoverStart = 0;
}

function hideFactCard() {
  el.factCard.classList.remove('active');
  setTimeout(() => {
    el.factCard.classList.add('hidden');

    // ▶️ استئناف المؤقت (فقط إذا كانت اللعبة لا تزال جارية)
    if (Game.running && !Game.timerInterval) {
      startTimer();
    }

    showFault(Game.faultIndex + 1);
  }, 350);
}

el.factContinueBtn.addEventListener('click', () => {
  Sound.tone(1200, 0.1, 'square', 0.08);
  hideFactCard();
});

/* =====================================================
   إغلاق الزووم
===================================================== */
el.zoomCloseBtn.addEventListener('click', () => {
  if (Game.faultFixed) return;
  el.zoomView.classList.remove('active');
  setTimeout(() => el.zoomView.classList.add('hidden'), 300);
  el.toolbar.classList.add('hidden');
  Game.toolbarVisible = false;
  releaseTool();
  Game.faultDiagnosed = false;
  Game.faultActive = true;
  Game.hoverStart = 0;
});

/* =====================================================
   المؤقت
===================================================== */
function startTimer() {
  clearInterval(Game.timerInterval);
  Game.timerInterval = setInterval(() => {
    if (!Game.running) return;
    Game.timeLeft--;
    el.hudTime.textContent = Game.timeLeft;

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
  clearTimeout(Game.hintTimeout);

  el.hud.classList.add('hidden');
  el.hintBar.classList.add('hidden');
  el.fingerCursor.classList.remove('visible');
  el.zoomView.classList.add('hidden');
  el.toolbar.classList.add('hidden');
  el.faultPoint.classList.add('hidden');
  el.factCard.classList.add('hidden');
  el.factCard.classList.remove('active');

  if (Game.score > Game.bestScore) {
    Game.bestScore = Game.score;
    localStorage.setItem('inspectorBestScoreV3', Game.bestScore.toString());
  }

  const stars = calculateStars(Game.score, won);

  el.endTitle.textContent = won ? '🎉 مهمة ناجحة!' : '⏰ انتهى الوقت!';
  el.stars.textContent = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
  el.finalScore.textContent = Game.score;
  el.finalFixed.textContent = `${Game.fixedFaults} / ${Game.totalFaults}`;
  el.bestScore.textContent = Game.bestScore;

  el.endScreen.classList.remove('hidden');
  Sound.end();

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      Particles.burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.5,
        ['#ffe066', '#00ff88', '#7ac0ff'][i % 3],
        40
      );
    }, i * 180);
  }
}

function calculateStars(score, won) {
  if (!won && Game.fixedFaults === 0) return 1;
  if (score >= 800) return 5;
  if (score >= 600) return 4;
  if (score >= 400) return 3;
  if (score >= 200) return 2;
  return 1;
}

/* =====================================================
   MediaPipe Hands
===================================================== */
async function initHands() {
  if (typeof Hands === 'undefined') {
    console.error('MediaPipe Hands غير محمّل');
    return false;
  }

  Game.hands = new Hands({
    locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`,
  });

  Game.hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    selfieMode: false,   // ← الكاميرا لا تعكس الصورة داخلياً
  });

  Game.hands.onResults(onHandsResults);
  return true;
}

async function startCamera() {
  if (typeof Camera === 'undefined') return false;
  Game.camera = new Camera(el.video, {
    onFrame: async () => {
      if (Game.hands) await Game.hands.send({ image: el.video });
    },
    width: 640,
    height: 480,
  });
  try {
    await Game.camera.start();
    return true;
  } catch (e) {
    console.error('فشل الكاميرا', e);
    showToast('⚠ سيعمل المؤشر بالماوس', 'error', 3000);
    return false;
  }
}

/* =====================================================
   معالجة نتائج الإصبع
===================================================== */
function onHandsResults(results) {
  if (el.camCanvas) {
    el.camCanvas.width = el.camCanvas.clientWidth;
    el.camCanvas.height = el.camCanvas.clientHeight;
    const ctx = el.camCanvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, el.camCanvas.width, el.camCanvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, el.camCanvas.width, el.camCanvas.height);
    ctx.restore();
  }

  if (!Game.running) return;

  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    Game.fingerActive = false;
    el.fingerCursor.classList.remove('visible');
    return;
  }

  const tip = results.multiHandLandmarks[0][8];
  // عكس الإحداثيات أفقياً لأن الصورة في الفيديو معروضة بشكل المرآة
  const x = (1 - tip.x) * window.innerWidth;
  const y = tip.y * window.innerHeight;

  Game.fingerActive = true;
  Game.fingerX = x;
  Game.fingerY = y;

  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = x + 'px';
  el.fingerCursor.style.top = y + 'px';

  // ⭐ إذا كانت بطاقة المعلومة مفتوحة
  if (el.factCard.classList.contains('active')) {
    const btnRect = el.factContinueBtn.getBoundingClientRect();
    const onBtn =
      x >= btnRect.left && x <= btnRect.right &&
      y >= btnRect.top && y <= btnRect.bottom;

    if (onBtn) {
      if (!Game.factBtnHoverStart) Game.factBtnHoverStart = performance.now();
      const elapsed = performance.now() - Game.factBtnHoverStart;
      if (elapsed >= 600) {
        Game.factBtnHoverStart = 0;
        el.factContinueBtn.click();
      }
    } else {
      Game.factBtnHoverStart = 0;
    }
    return;
  }

  // منطق التفاعل
  if (Game.holdingTool) {
    checkDropWithDelay(x, y);
  } else if (Game.toolbarVisible && Game.faultDiagnosed && !Game.faultFixed) {
    checkToolHover(x, y);
  } else {
    checkHover(x, y);
  }
}

/* =====================================================
   دعم الماوس
===================================================== */
document.addEventListener('mousemove', (e) => {
  if (!Game.running || Game.fingerActive) return;

  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = e.clientX + 'px';
  el.fingerCursor.style.top = e.clientY + 'px';

  // بطاقة المعلومة
  if (el.factCard.classList.contains('active')) {
    const btnRect = el.factContinueBtn.getBoundingClientRect();
    const onBtn =
      e.clientX >= btnRect.left && e.clientX <= btnRect.right &&
      e.clientY >= btnRect.top && e.clientY <= btnRect.bottom;

    if (onBtn) {
      if (!Game.factBtnHoverStart) Game.factBtnHoverStart = performance.now();
      const elapsed = performance.now() - Game.factBtnHoverStart;
      if (elapsed >= 600) {
        Game.factBtnHoverStart = 0;
        el.factContinueBtn.click();
      }
    } else {
      Game.factBtnHoverStart = 0;
    }
    return;
  }

  if (Game.holdingTool) {
    checkDropWithDelay(e.clientX, e.clientY);
  } else if (Game.toolbarVisible && Game.faultDiagnosed && !Game.faultFixed) {
    checkToolHover(e.clientX, e.clientY);
  } else {
    checkHover(e.clientX, e.clientY);
  }
});

document.addEventListener('mouseup', (e) => {
  if (!Game.running || Game.fingerActive) return;
  if (Game.holdingTool) tryDropTool(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
  if (!Game.running || Game.fingerActive) return;
  const t = e.touches[0];
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = t.clientX + 'px';
  el.fingerCursor.style.top = t.clientY + 'px';

  if (el.factCard.classList.contains('active')) {
    const btnRect = el.factContinueBtn.getBoundingClientRect();
    const onBtn =
      t.clientX >= btnRect.left && t.clientX <= btnRect.right &&
      t.clientY >= btnRect.top && t.clientY <= btnRect.bottom;

    if (onBtn) {
      if (!Game.factBtnHoverStart) Game.factBtnHoverStart = performance.now();
      const elapsed = performance.now() - Game.factBtnHoverStart;
      if (elapsed >= 600) {
        Game.factBtnHoverStart = 0;
        el.factContinueBtn.click();
      }
    } else {
      Game.factBtnHoverStart = 0;
    }
    return;
  }

  if (Game.holdingTool) {
    checkDropWithDelay(t.clientX, t.clientY);
  } else if (Game.toolbarVisible && Game.faultDiagnosed && !Game.faultFixed) {
    checkToolHover(t.clientX, t.clientY);
  } else {
    checkHover(t.clientX, t.clientY);
  }
}, { passive: true });

/* =====================================================
   أزرار النهاية
===================================================== */
el.replayBtn.addEventListener('click', () => {
  el.endScreen.classList.add('hidden');
  startGame();
});

el.menuBtn.addEventListener('click', () => {
  el.endScreen.classList.add('hidden');
  el.startScreen.classList.remove('hidden');
  el.scene.classList.add('hidden');
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
});

/* =====================================================
   تغيير حجم النافذة
===================================================== */
window.addEventListener('resize', () => {
  if (Game.faultActive && Game.currentFault && !Game.faultFixed) {
    const sceneRect = el.scene.getBoundingClientRect();
    Game.faultScreenX = (Game.currentFault.pos.x / 100) * sceneRect.width;
    Game.faultScreenY = (Game.currentFault.pos.y / 100) * sceneRect.height;
    el.faultPoint.style.left = Game.faultScreenX + 'px';
    el.faultPoint.style.top = Game.faultScreenY + 'px';
  }
});

/* =====================================================
   التهيئة
===================================================== */
Particles.init();
el.bestScore.textContent = Game.bestScore;

console.log('%c🏗️ المهندس الفاحص v3 - FINAL', 'color:#ffe066;font-size:20px;font-weight:900;');
