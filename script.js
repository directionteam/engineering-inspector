* =====================================================
   المهندس الفاحص v3 - FINAL EDITION
   كل التعديلات: كاميرا - بطاقة تعليمية - منع تكرار
   المهندس الفاحص v4 - ULTIMATE EDITION
   + شريط التقدم + المتصدرون + وميض الوقت + تسلسل منطقي + Avatar
===================================================== */

/* ==================== الصعوبة ==================== */
@@ -11,139 +11,140 @@ const DIFFICULTIES = {
};

/* =====================================================
   الأعطال (مع معلومة تعليمية)
   الأعطال + التسلسل المنطقي
   next: مصفوفة الأعطال التي يُفضّل أن تليها (منطقياً)
===================================================== */
const FAULTS = [
  {
    id: 'solar_crack',
    deviceName: 'SOLAR PANEL',
    title: 'خلية شمسية مكسورة',
    info: 'شرخ دقيق في الخلية رقم 7 يمنع توليد الطاقة من هذه المنطقة.',
    fact: 'الشقوق الدقيقة تقلل كفاءة اللوحة بنسبة 10-30%. الخلية الواحدة التالفة تُعطّل السلسلة بأكملها.',
    info: 'شرخ دقيق في الخلية رقم 7 يمنع توليد الطاقة.',
    fact: 'الشقوق الدقيقة تقلل كفاءة اللوحة بنسبة 10-30%.',
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
    next: ['cable_cut', 'missing_screw'],
    renderZoom: renderSolarCrack,
  },
  {
    id: 'cable_cut',
    deviceName: 'DC CABLE',
    title: 'كابل DC مقطوع',
    info: 'انقطاع في الكابل الأحمر بين اللوحة وصندوق التجميع.',
    fact: 'الكابلات DC تنقل تياراً عالياً (10-20 أمبير). القطع يوقف نقل الطاقة فوراً ويسبب شرارة.',
    tip: 'استخدم كابلات مقاومة للأشعة UV، وافحص العزل سنوياً.',
    fact: 'الكابلات DC تنقل تياراً عالياً. القطع يوقف الطاقة ويسبب شرارة.',
    tip: 'استخدم كابلات مقاومة UV، وافحص العزل سنوياً.',
    pos: { x: 33, y: 50 },
    targetZone: { x: 400, y: 180, w: 300, h: 220 },
    correctTool: 'cable',
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
    fact: 'الفيوز يحمي النظام من التيار الزائد. عند احتراقه، يقطع الدائرة لحماية باقي المكونات.',
    tip: 'اختر فيوزاً بنفس الأمبير الموصى به، ولا تستبدله بسلك أبداً.',
    fact: 'الفيوز يحمي النظام من التيار الزائد.',
    tip: 'اختر فيوزاً بنفس الأمبير، ولا تستبدله بسلك أبداً.',
    pos: { x: 42, y: 48 },
    targetZone: { x: 400, y: 230, w: 240, h: 220 },
    correctTool: 'fuse',
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
    fact: 'المنظم ينظّم جهد الشحن من اللوحة إلى البطارية. يمنع الشحن الزائد الذي يتلف البطارية.',
    fact: 'المنظم ينظّم جهد الشحن ويمنع الشحن الزائد.',
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
    next: ['battery_low', 'inverter_burn'],
    renderZoom: renderControllerFail,
  },
  {
    id: 'battery_low',
    deviceName: 'BATTERY PACK',
    title: 'خلية بطارية منتفخة',
    info: 'الخلية رقم 3 منتفخة ولا تحفظ الشحن.',
    fact: 'الخلية المنتفخة نتيجة تفاعلات كيميائية داخلية. قد تتسبب في حريق إذا لم تُستبدل.',
    tip: 'لا تشحن البطارية في حرارة عالية، وافحص الجهد بانتظام.',
    fact: 'الخلية المنتفخة قد تتسبب في حريق إذا لم تُستبدل.',
    tip: 'لا تشحن البطارية في حرارة عالية.',
    pos: { x: 75, y: 46 },
    targetZone: { x: 360, y: 220, w: 280, h: 240 },
    correctTool: 'batteryCell',
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
    fact: 'العاكس يحوّل DC إلى AC بتردد 50/60 Hz. ارتفاع الحرارة يحرق المكثفات.',
    fact: 'العاكس يحوّل DC إلى AC. ارتفاع الحرارة يحرق المكثفات.',
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
    next: ['missing_screw'],
    renderZoom: renderInverterBurn,
  },
  {
    id: 'missing_screw',
    deviceName: 'MOUNTING BRACKET',
    title: 'برغي ناقص في الحامل',
    info: 'البرغي رقم 4 مفقود.',
    fact: 'البراغي تحفظ استقرار اللوحة. نقصها يعرض اللوحة للاهتزاز والتلف عند الرياح.',
    tip: 'افحص البراغي كل 3 أشهر، خاصة بعد الرياح القوية.',
    fact: 'البرغي يحفظ استقرار اللوحة ضد الاهتزاز.',
    tip: 'افحص البراغي كل 3 أشهر.',
    pos: { x: 22, y: 55 },
    targetZone: { x: 540, y: 280, w: 220, h: 200 },
    correctTool: 'screwdriver',
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
   رسومات SVG
===================================================== */
function renderSolarCrack() {
  return `
@@ -174,16 +175,10 @@ function renderSolarCrack() {
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
@@ -193,33 +188,21 @@ function renderCableCut() {
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
@@ -229,43 +212,23 @@ function renderFuseBlown() {
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
        <rect x="360" y="150" width="80" height="130" rx="8"
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
@@ -275,21 +238,13 @@ function renderControllerFail() {
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="200" y="80" width="400" height="240" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <text x="400" y="120" text-anchor="middle" fill="#7ac0ff" font-size="16" font-family="monospace">CHARGE CONTROLLER</text>
      <rect x="250" y="140" width="300" height="100" rx="8" fill="#1a0a0a" stroke="#ff3b3b" stroke-width="3">
        <animate attributeName="fill" values="#1a0a0a;#3a0a0a;#1a0a0a" dur="1.2s" repeatCount="indefinite"/>
      </rect>
      <text x="400" y="180" text-anchor="middle" fill="#ff3b3b" font-size="26" font-family="monospace" font-weight="900">ERROR</text>
      <text x="400" y="215" text-anchor="middle" fill="#ff3b3b" font-size="22" font-family="monospace">E7</text>
      <text x="400" y="185" text-anchor="middle" fill="#ff3b3b" font-size="30" font-family="monospace" font-weight="900">E7</text>
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
@@ -299,33 +254,17 @@ function renderBatteryLow() {
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="800" height="400" fill="#0a1a2e"/>
      <rect x="100" y="60" width="600" height="280" rx="20" fill="#1a3a5e" stroke="#4a7fc4" stroke-width="3"/>
      <text x="400" y="100" text-anchor="middle" fill="#7ac0ff" font-size="16" font-family="monospace">BATTERY PACK — CROSS SECTION</text>
      <rect x="140" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
      <rect x="230" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
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
        <rect x="320" y="130" width="80" height="180" rx="8" fill="#5a1f1f" stroke="#ff3b3b" stroke-width="3">
          <animate attributeName="width" values="80;90;80" dur="1.5s" repeatCount="indefinite"/>
        </rect>
        <text x="360" y="230" text-anchor="middle" fill="#ff8b8b" font-size="24" font-family="monospace">⚠</text>
      </g>
      <polygon points="360,80 340,55 380,55" fill="#ff5757">
        <animate attributeName="points" values="360,80 340,55 380,55;360,90 340,65 380,65;360,80 340,55 380,55" dur="1s" repeatCount="indefinite"/>
      </polygon>
      <text x="400" y="380" text-anchor="middle" fill="#ff5757" font-size="16" font-family="monospace">
        ⚠ CELL #3 DAMAGED
      </text>
      <rect x="410" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
      <rect x="500" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
      <rect x="590" y="140" width="80" height="160" rx="8" fill="#2d8f4a" stroke="#00ff88" stroke-width="2"/>
    </svg>
  `;
}
@@ -337,40 +276,21 @@ function renderInverterBurn() {
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
      <g fill="rgba(120,120,120,0.4)">
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
@@ -395,19 +315,9 @@ function renderMissingScrew() {
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
      <circle cx="540" cy="280" r="20" fill="none" stroke="#ff3b3b" stroke-width="3" stroke-dasharray="6,4">
        <animate attributeName="r" values="20;26;20" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
}
@@ -449,16 +359,21 @@ const Game = {

  toolbarVisible: false,
  usedFaults: [],
  lastFaultId: null,

  factBtnHoverStart: 0,

  bestScore: parseInt(localStorage.getItem('inspectorBestScoreV3') || '0', 10),
  // وميض الوقت
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
@@ -474,6 +389,8 @@ const el = {
  hudCombo: document.getElementById('hudCombo'),
  comboBox: document.getElementById('comboBox'),

  progressFill: document.getElementById('progressFill'),

  endTitle: document.getElementById('endTitle'),
  stars: document.getElementById('stars'),
  finalScore: document.getElementById('finalScore'),
@@ -507,10 +424,23 @@ const el = {
  factText: document.getElementById('factText'),
  factTip: document.getElementById('factTip'),
  factContinueBtn: document.getElementById('factContinueBtn'),

  // Avatar
  avatarBubble: document.getElementById('avatarBubble'),

  // المتصدرون
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
   نظام الأصوات
   الأصوات
===================================================== */
const Sound = {
  ctx: null,
@@ -545,7 +475,6 @@ const Sound = {
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
@@ -554,7 +483,6 @@ const Sound = {
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
@@ -576,14 +504,16 @@ const Sound = {
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
        setTimeout(() => this.tone(220, 0.3, 'sawtooth', 0.08), 150);
        break;
      case 'cable_cut':
        this.noise(0.5, 0.12, 3000);
@@ -598,10 +528,7 @@ const Sound = {
        break;
      case 'battery_low':
        this.noise(0.08, 0.15, 800);
        setTimeout(() => {
          this.tone(330, 0.4, 'sine', 0.1);
          this.tone(440, 0.5, 'sine', 0.08, 0.2);
        }, 100);
        setTimeout(() => this.tone(330, 0.4, 'sine', 0.1), 100);
        break;
      case 'inverter_burn':
        this.noise(0.6, 0.08, 1500);
@@ -610,7 +537,6 @@ const Sound = {
      case 'missing_screw':
        this.tone(400, 0.05, 'square', 0.08);
        setTimeout(() => this.tone(600, 0.05, 'square', 0.08), 100);
        setTimeout(() => this.tone(800, 0.15, 'sine', 0.1), 200);
        break;
      default:
        this.tone(1000, 0.3, 'sine', 0.12);
@@ -630,12 +556,6 @@ const Sound = {
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

@@ -721,6 +641,17 @@ function showToast(text, type = 'info', duration = 1800) {
  el.toast._timeout = setTimeout(() => el.toast.classList.remove('show'), duration);
}

/* =====================================================
   فقاعة Avatar
===================================================== */
let avatarTimeout = null;
function avatarSay(text, duration = 2500) {
  el.avatarBubble.textContent = text;
  el.avatarBubble.classList.add('show');
  clearTimeout(avatarTimeout);
  avatarTimeout = setTimeout(() => el.avatarBubble.classList.remove('show'), duration);
}

/* =====================================================
   اختيار الصعوبة
===================================================== */
@@ -734,6 +665,94 @@ document.querySelectorAll('.diff-btn').forEach(btn => {
  });
});

/* =====================================================
   المتصدرون
===================================================== */
const Leaderboard = {
  key: 'inspectorLeaderboardV4',

  getAll() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  },

  save(name, score, fixed, total, stars) {
    const all = this.getAll();
    all.push({
      name: name || 'مجهول',
      score,
      fixed,
      total,
      stars,
      date: Date.now(),
    });
    all.sort((a, b) => b.score - a.score);
    const top5 = all.slice(0, 5);
    localStorage.setItem(this.key, JSON.stringify(top5));
    return top5;
  },

  render() {
    const list = this.getAll();
    if (list.length === 0) {
      el.leaderboardList.innerHTML = '<div class="leaderboard-empty">لا توجد نتائج محفوظة بعد.<br>كن أول المتصدرين!</div>';
      return;
    }

    el.leaderboardList.innerHTML = list.map((entry, i) => {
      const rank = i + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
      return `
        <div class="leaderboard-row rank-${rank}">
          <div class="rank-badge">${medal}</div>
          <div class="leaderboard-name">${escapeHtml(entry.name)}</div>
          <div class="leaderboard-score">${entry.score}</div>
        </div>
      `;
    }).join('');
  },
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

function openLeaderboard() {
  Leaderboard.render();
  el.leaderboardScreen.classList.remove('hidden');
}

function closeLeaderboard() {
  el.leaderboardScreen.classList.add('hidden');
}

el.closeLeaderboardBtn.addEventListener('click', () => {
  closeLeaderboard();
  el.startScreen.classList.remove('hidden');
  el.scene.classList.add('hidden');
  el.hud.classList.add('hidden');
});

el.startLeaderboardBtn.addEventListener('click', openLeaderboard);
el.showLeaderboardBtn.addEventListener('click', openLeaderboard);

el.saveScoreBtn.addEventListener('click', () => {
  const name = (el.playerName.value || '').trim() || 'مجهول';
  const stars = el.stars.textContent.split('⭐').length - 1;
  Leaderboard.save(name, Game.score, Game.fixedFaults, Game.totalFaults, stars);

  el.nameInputWrapper.classList.add('saved');
  showToast('✅ تم حفظ النتيجة!', 'success', 1500);

  setTimeout(() => {
    openLeaderboard();
  }, 800);
});

/* =====================================================
   بدء اللعبة
===================================================== */
@@ -742,6 +761,7 @@ async function startGame() {

  el.startScreen.classList.add('hidden');
  el.endScreen.classList.add('hidden');
  el.leaderboardScreen.classList.add('hidden');
  el.scene.classList.remove('hidden');
  el.hud.classList.remove('hidden');
  el.hintBar.classList.remove('hidden');
@@ -760,7 +780,9 @@ async function startGame() {
  Game.holdingTool = null;
  Game.toolbarVisible = false;
  Game.usedFaults = [];
  Game.lastFaultId = null;
  Game.factBtnHoverStart = 0;
  Game.timeWarnActive = false;

  el.hudScore.textContent = '0';
  el.hudTime.textContent = Game.timeLeft;
@@ -770,12 +792,17 @@ async function startGame() {
  el.cursorTool.textContent = '';
  el.factCard.classList.add('hidden');
  el.factCard.classList.remove('active');
  el.progressFill.style.width = '0%';
  el.nameInputWrapper.classList.remove('saved');
  el.app.classList.remove('time-warning', 'time-critical');

  const handsReady = await initHands();
  if (handsReady) await startCamera();

  startTimer();

  avatarSay('هيا نبدأ! 👷', 3000);

  setTimeout(() => {
    showFault(0);
    showToast('🎯 ابحث عن العطل الأول', 'info', 2200);
@@ -785,21 +812,37 @@ async function startGame() {
}

/* =====================================================
   عرض العطل (مع منع التكرار)
   عرض العطل (بتسلسل منطقي)
===================================================== */
function showFault(index) {
  if (index >= Game.totalFaults) { endGame(true); return; }

  // اختر عطلاً لم يُستخدم بعد
  let availableFaults = FAULTS.filter(f => !Game.usedFaults.includes(f.id));
  // اختر العطل التالي بناءً على "next" من العطل السابق
  let pool = [];
  if (Game.lastFaultId) {
    const last = FAULTS.find(f => f.id === Game.lastFaultId);
    if (last && last.next) {
      // رشّح الأعطال من next التي لم تُستخدم
      pool = last.next
        .map(id => FAULTS.find(f => f.id === id))
        .filter(f => f && !Game.usedFaults.includes(f.id));
    }
  }

  // إذا لم نجد مرشحين من التسلسل، استخدم أي عطل غير مستخدم
  if (pool.length === 0) {
    pool = FAULTS.filter(f => !Game.usedFaults.includes(f.id));
  }

  if (availableFaults.length === 0) {
  // إذا استُنفدت كل الأعطال، أعد التصفير
  if (pool.length === 0) {
    Game.usedFaults = [];
    availableFaults = FAULTS.slice();
    pool = FAULTS.slice();
  }

  const chosen = availableFaults[Math.floor(Math.random() * availableFaults.length)];
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  Game.usedFaults.push(chosen.id);
  Game.lastFaultId = chosen.id;

  Game.faultIndex = index;
  Game.currentFault = chosen;
@@ -831,7 +874,7 @@ function showFault(index) {
}

/* =====================================================
   فحص Hover على العطل
   Hover على العطل
===================================================== */
function checkHover(x, y) {
  if (!Game.faultActive || Game.faultFixed || Game.faultDiagnosed) return;
@@ -897,10 +940,11 @@ function diagnoseFault() {
  el.hintBar.innerHTML = '🖐️ مرّر إصبعك فوق الأداة الصحيحة (ابقَ عليها لحظة)';

  showToast('🔍 تم التشخيص — اختر الأداة', 'info', 2000);
  avatarSay('اختر الأداة المناسبة! 🔧', 3000);
}

/* =====================================================
   تجهيز شريط الأدوات
   شريط الأدوات
===================================================== */
function prepareToolbar(fault) {
  el.toolbarTools.innerHTML = '';
@@ -954,7 +998,7 @@ function pickTool(tool, btnEl) {
}

/* =====================================================
   اختيار الأداة بالإصبع (hover 400ms)
   Hover الأداة بالإصبع
===================================================== */
let toolHoverTimer = null;
let toolHoverTarget = null;
@@ -1005,7 +1049,7 @@ function checkToolHover(x, y) {
}

/* =====================================================
   إفلات الأداة (600ms في منطقة العطل)
   إفلات الأداة
===================================================== */
let dropTimer = null;

@@ -1040,9 +1084,6 @@ function checkDropWithDelay(x, y) {
  }
}

/* =====================================================
   محاولة إفلات الأداة
===================================================== */
function tryDropTool(x, y) {
  if (!Game.holdingTool || Game.faultFixed) return;

@@ -1077,7 +1118,8 @@ function tryDropTool(x, y) {
function wrongToolAttempt(toolEl) {
  Sound.wrongTool();
  shakeScene();
  showToast('❌ أداة خاطئة! قد تسبب ضرراً', 'error', 1800);
  showToast('❌ أداة خاطئة!', 'error', 1800);
  avatarSay('أداة خاطئة! جرب غيرها 😅', 2500);

  if (toolEl) toolEl.classList.add('wrong-pick');
  setTimeout(() => {
@@ -1134,10 +1176,15 @@ function applyRepair(x, y) {

  showToast(`✅ +${total} نقطة!`, 'success', 1800);

  // تحديث شريط التقدم
  updateProgress();

  releaseTool();
  flashZoom();
  Game.fixedFaults++;

  avatarSay('أحسنت! 💪', 2000);

  setTimeout(() => {
    el.zoomView.classList.remove('active');
    setTimeout(() => {
@@ -1148,12 +1195,16 @@ function applyRepair(x, y) {

      document.querySelectorAll('.window-light').forEach(w => w.classList.add('on'));

      // 📚 اعرض البطاقة التعليمية
      showFactCard(fault);
    }, 350);
  }, 900);
}

function updateProgress() {
  const percent = (Game.fixedFaults / Game.totalFaults) * 100;
  el.progressFill.style.width = percent + '%';
}

function flashZoom() {
  let count = 0;
  const iv = setInterval(() => {
@@ -1172,10 +1223,10 @@ function shakeScene() {
}

/* =====================================================
   بطاقة المعلومة التعليمية
   بطاقة المعلومة
===================================================== */
function showFactCard(fault) {
  // ⏸️ أوقف المؤقت
  // إيقاف المؤقت
  clearInterval(Game.timerInterval);
  Game.timerInterval = null;

@@ -1196,7 +1247,7 @@ function hideFactCard() {
  setTimeout(() => {
    el.factCard.classList.add('hidden');

    // ▶️ استئناف المؤقت (فقط إذا كانت اللعبة لا تزال جارية)
    // استئناف المؤقت
    if (Game.running && !Game.timerInterval) {
      startTimer();
    }
@@ -1226,7 +1277,7 @@ el.zoomCloseBtn.addEventListener('click', () => {
});

/* =====================================================
   المؤقت
   المؤقت + وميض الوقت
===================================================== */
function startTimer() {
  clearInterval(Game.timerInterval);
@@ -1235,9 +1286,18 @@ function startTimer() {
    Game.timeLeft--;
    el.hudTime.textContent = Game.timeLeft;

    // وميض في آخر 10 ثوانٍ
    if (Game.timeLeft <= 10) {
      el.hudTime.classList.add('warning');
      if (Game.timeLeft > 0) Sound.tick();

      // وميض أحمر عند آخر 5 ثوانٍ
      if (Game.timeLeft <= 5) {
        el.app.classList.add('time-warning');
        if (Game.timeLeft <= 3) {
          el.app.classList.add('time-critical');
        }
      }
    }

    if (Game.timeLeft <= 0) {
@@ -1263,10 +1323,11 @@ function endGame(won) {
  el.faultPoint.classList.add('hidden');
  el.factCard.classList.add('hidden');
  el.factCard.classList.remove('active');
  el.app.classList.remove('time-warning', 'time-critical');

  if (Game.score > Game.bestScore) {
    Game.bestScore = Game.score;
    localStorage.setItem('inspectorBestScoreV3', Game.bestScore.toString());
    localStorage.setItem('inspectorBestScoreV4', Game.bestScore.toString());
  }

  const stars = calculateStars(Game.score, won);
@@ -1278,7 +1339,10 @@ function endGame(won) {
  el.bestScore.textContent = Game.bestScore;

  el.endScreen.classList.remove('hidden');

  // عرض المتصدرين تلقائياً إذا كانت النتيجة جيدة
  Sound.end();
  avatarSay('انتهت المهمة! 🏁', 3000);

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
@@ -1302,7 +1366,7 @@ function calculateStars(score, won) {
}

/* =====================================================
   MediaPipe Hands
   MediaPipe
===================================================== */
async function initHands() {
  if (typeof Hands === 'undefined') {
@@ -1319,7 +1383,7 @@ async function initHands() {
    modelComplexity: 0,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    selfieMode: false,   // ← الكاميرا لا تعكس الصورة داخلياً
    selfieMode: false,
  });

  Game.hands.onResults(onHandsResults);
@@ -1346,7 +1410,7 @@ async function startCamera() {
}

/* =====================================================
   معالجة نتائج الإصبع
   معالجة الإصبع
===================================================== */
function onHandsResults(results) {
  if (el.camCanvas) {
@@ -1368,7 +1432,6 @@ function onHandsResults(results) {
  }

  const tip = results.multiHandLandmarks[0][8];
  // عكس الإحداثيات أفقياً لأن الصورة في الفيديو معروضة بشكل المرآة
  const x = (1 - tip.x) * window.innerWidth;
  const y = tip.y * window.innerHeight;

@@ -1381,23 +1444,9 @@ function onHandsResults(results) {
  el.fingerCursor.style.left = x + 'px';
  el.fingerCursor.style.top = y + 'px';

  // ⭐ إذا كانت بطاقة المعلومة مفتوحة
  // بطاقة المعلومة مفتوحة؟
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
    handleFactButtonHover(x, y);
    return;
  }

@@ -1411,6 +1460,24 @@ function onHandsResults(results) {
  }
}

function handleFactButtonHover(x, y) {
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
}

/* =====================================================
   دعم الماوس
===================================================== */
@@ -1422,23 +1489,8 @@ document.addEventListener('mousemove', (e) => {
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
    handleFactButtonHover(e.clientX, e.clientY);
    return;
  }

@@ -1465,21 +1517,7 @@ document.addEventListener('touchmove', (e) => {
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
    handleFactButtonHover(t.clientX, t.clientY);
    return;
  }

@@ -1504,6 +1542,7 @@ el.menuBtn.addEventListener('click', () => {
  el.endScreen.classList.add('hidden');
  el.startScreen.classList.remove('hidden');
  el.scene.classList.add('hidden');
  el.hud.classList.add('hidden');
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
});

@@ -1526,4 +1565,5 @@ window.addEventListener('resize', () => {
Particles.init();
el.bestScore.textContent = Game.bestScore;

console.log('%c🏗️ المهندس الفاحص v3 - FINAL', 'color:#ffe066;font-size:20px;font-weight:900;');
console.log('%c🏗️ المهندس الفاحص v4 - ULTIMATE', 'color:#ffe066;font-size:20px;font-weight:900;');
console.log('%c+ Progress Bar · Leaderboard · Time Warning · Smart Sequence · Avatar', 'color:#7ac0ff;font-size:11px;');
