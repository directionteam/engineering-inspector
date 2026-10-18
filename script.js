/* =====================================================
   SOLAR PLANT SIMULATOR v6 - LOGIC & AI
   هندسة حقيقية - بدون رسومات كرتونية
===================================================== */

/* ==================== الأعطال الهندسية ==================== */
const FAULTS = {
  'PV ARRAY': {
    title: 'PV ARRAY // LOW OUTPUT',
    data: 'Voltage: 18V (Nominal: 24V)<br>Current: 2A (Expected: 8A)<br>Status: HIGH RESISTANCE',
    actions: [
      { text: 'Clean dust from solar panels', correct: false },
      { text: 'Replace bypass diode', correct: true }, // الإجراء الصحيح
      { text: 'Increase load capacity', correct: false },
      { text: 'Reset charge controller', correct: false },
    ],
    fact: 'Bypass diodes prevent hot spots. A failed diode limits the array voltage.',
    nodePos: { x: 150, y: 300 }
  },
  'CHG CTRL': {
    title: 'CHARGE CONTROLLER // OVERHEAT',
    data: 'Temp: 85°C (Max: 60°C)<br>Status: THERMAL THROTTLING<br>Output: 0A',
    actions: [
      { text: 'Replace unit immediately', correct: false },
      { text: 'Clear blocked ventilation fan', correct: true },
      { text: 'Bypass the controller', correct: false },
      { text: 'Increase battery voltage', correct: false },
    ],
    fact: 'Charge controllers require active cooling. Dust accumulation causes thermal shutdown.',
    nodePos: { x: 450, y: 300 }
  },
  'BATTERY': {
    title: 'BATTERY BANK // VOLTAGE DROP',
    data: 'Bank Voltage: 11.2V (Critical)<br>Cable Length: 20m<br>Voltage Drop: 4.5V (Max: 3%)',
    actions: [
      { text: 'Add water to battery cells', correct: false },
      { text: 'Replace with 2mm² cable', correct: false },
      { text: 'Upgrade to 10mm² cable', correct: true },
      { text: 'Increase charger output', correct: false },
    ],
    fact: 'Long cable runs cause voltage drop. A thicker gauge (10mm²) is required for 50A loads.',
    nodePos: { x: 750, y: 300 }
  },
  'INVERTER': {
    title: 'INVERTER // FREQUENCY MISMATCH',
    data: 'Output: 220V AC<br>Frequency: 60Hz<br>Load: 50Hz Motors (Failing)',
    actions: [
      { text: 'Replace inverter cooling fan', correct: false },
      { text: 'Adjust output frequency to 50Hz', correct: true },
      { text: 'Add step-up transformer', correct: false },
      { text: 'Replace load equipment', correct: false },
    ],
    fact: 'Grid-tied equipment requires exact frequency match. 60Hz inverter will damage 50Hz motors.',
    nodePos: { x: 1050, y: 300 }
  }
};

/* ==================== حالة اللعبة ==================== */
const Game = {
  running: false,
  score: 0,
  timeLeft: 120, // وقت المحاكاة
  totalFaults: 4,
  fixedFaults: 0,
  
  currentFaultKey: null,
  faultActive: false,
  diagnosed: false,

  // الكاميرا
  camera: null,
  hands: null,
  fingerActive: false,
  fingerX: 0,
  fingerY: 0,

  hoverStart: 0,
  hoverDuration: 800, // 0.8 ثانية للفتح
  
  // المؤقت
  timerInterval: null,
};

/* ==================== عناصر DOM ==================== */
const el = {
  startScreen: document.getElementById('startScreen'),
  endScreen: document.getElementById('endScreen'),
  startBtn: document.getElementById('startBtn'),
  replayBtn: document.getElementById('replayBtn'),
  
  hud: document.getElementById('hud'),
  hudTime: document.getElementById('hudTime'),
  hudScore: document.getElementById('hudScore'),
  hudFaults: document.getElementById('hudFaults'),
  systemStatus: document.getElementById('systemStatus'),
  
  scene: document.getElementById('scene'),
  faultIndicator: document.getElementById('fault-indicator'),
  
  diagnosisPanel: document.getElementById('diagnosisPanel'),
  diagNode: document.getElementById('diagNode'),
  diagText: document.getElementById('diagText'),
  
  actionPanel: document.getElementById('actionPanel'),
  actionList: document.getElementById('actionList'),
  
  fingerCursor: document.getElementById('fingerCursor'),
  video: document.getElementById('video'),
  camCanvas: document.getElementById('camCanvas'),
  
  toast: document.getElementById('toast'),
  particles: document.getElementById('particles'),
  
  endTitle: document.getElementById('endTitle'),
  finalScore: document.getElementById('finalScore'),
  finalFixed: document.getElementById('finalFixed'),
  playerName: document.getElementById('playerName'),
  saveScoreBtn: document.getElementById('saveScoreBtn'),
};

/* ==================== الأصوات التقنية ==================== */
const Sound = {
  ctx: null,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  beep(freq, dur, type = 'square', vol = 0.05) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  },
  ping() { this.beep(1200, 0.05, 'sine', 0.03); },
  success() { 
    this.beep(800, 0.1, 'square', 0.05); 
    setTimeout(() => this.beep(1200, 0.2, 'square', 0.05), 100); 
  },
  error() { 
    this.beep(200, 0.2, 'sawtooth', 0.08); 
  }
};

/* ==================== Toast ==================== */
function showToast(text, isError = false) {
  el.toast.textContent = text;
  el.toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => el.toast.classList.remove('show'), 2500);
}

/* ==================== بدء اللعبة ==================== */
async function startGame() {
  Sound.init();
  
  el.startScreen.classList.add('hidden');
  el.endScreen.classList.add('hidden');
  el.hud.classList.remove('hidden');
  el.scene.classList.remove('hidden');
  
  Game.running = true;
  Game.score = 0;
  Game.fixedFaults = 0;
  Game.timeLeft = 120;
  
  el.hudScore.textContent = '0';
  el.hudTime.textContent = '120';
  el.hudFaults.textContent = '0 / 4';
  
  // تشغيل الكاميرا
  await initHands();
  await startCamera();
  
  startTimer();
  spawnFault();
}

/* ==================== المؤقت ==================== */
function startTimer() {
  clearInterval(Game.timerInterval);
  Game.timerInterval = setInterval(() => {
    if (!Game.running) return;
    Game.timeLeft--;
    el.hudTime.textContent = Game.timeLeft + 's';
    
    if (Game.timeLeft <= 0) {
      clearInterval(Game.timerInterval);
      endGame(false);
    }
  }, 1000);
}

/* ==================== إنشاء العطل ==================== */
function spawnFault() {
  if (Game.fixedFaults >= Game.totalFaults) {
    endGame(true);
    return;
  }

  // اختر عطلاً عشوائياً
  const keys = Object.keys(FAULTS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  Game.currentFaultKey = randomKey;
  const fault = FAULTS[randomKey];
  
  // ضع مؤشر العطل (Fault Indicator)
  el.faultIndicator.setAttribute('cx', fault.nodePos.x);
  el.faultIndicator.setAttribute('cy', fault.nodePos.y);
  el.faultIndicator.classList.remove('hidden');
  
  Game.faultActive = true;
  Game.diagnosed = false;
  
  el.hudFaults.textContent = `${Game.fixedFaults + 1} / ${Game.totalFaults}`;
  el.systemStatus.textContent = 'FAULT DETECTED IN SYSTEM';
  el.systemStatus.className = 'status-error';
}

/* ==================== الكاميرا و MediaPipe ==================== */
async function initHands() {
  Game.hands = new Hands({
    locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`,
  });
  Game.hands.setOptions({
    maxNumHands: 1, modelComplexity: 0,
    minDetectionConfidence: 0.6, minTrackingConfidence: 0.6,
    selfieMode: false,
  });
  Game.hands.onResults(onHandsResults);
}

async function startCamera() {
  Game.camera = new Camera(el.video, {
    onFrame: async () => { await Game.hands.send({ image: el.video }); },
    width: 640, height: 480,
  });
  await Game.camera.start();
}

/* ==================== معالجة الإصبع ==================== */
function onHandsResults(results) {
  // ارسم الفيديو
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
  const x = (1 - tip.x) * window.innerWidth;
  const y = tip.y * window.innerHeight;

  Game.fingerActive = true;
  Game.fingerX = x;
  Game.fingerY = y;

  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = x + 'px';
  el.fingerCursor.style.top = y + 'px';

  // منطق التفاعل
  if (Game.faultActive && !Game.diagnosed) {
    checkFaultHover(x, y);
  } else if (Game.diagnosed) {
    checkActionHover(x, y);
  }
}

/* ==================== 1. فحص العطل ==================== */
function checkFaultHover(x, y) {
  const fault = FAULTS[Game.currentFaultKey];
  
  // حساب موقع العقدة على الشاشة
  const svg = document.getElementById('schematicSVG');
  const pt = svg.createSVGPoint();
  pt.x = fault.nodePos.x;
  pt.y = fault.nodePos.y;
  const screenPt = pt.matrixTransform(svg.getScreenCTM());

  // المسافة بين الإصبع والعقدة
  const dx = x - screenPt.x;
  const dy = y - screenPt.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 80) { // إذا اقترب من العقدة
    if (!Game.hoverStart) {
      Game.hoverStart = performance.now();
      Sound.ping();
    }
    const elapsed = performance.now() - Game.hoverStart;
    
    if (elapsed >= Game.hoverDuration) {
      triggerDiagnosis(fault);
    }
  } else {
    Game.hoverStart = 0;
  }
}

function triggerDiagnosis(fault) {
  Game.faultActive = false;
  Game.diagnosed = true;
  Game.hoverStart = 0;
  
  Sound.beep(1000, 0.1, 'sine', 0.05);
  
  // إظهار بيانات التشخيص
  el.diagNode.textContent = Game.currentFaultKey;
  el.diagText.innerHTML = fault.data;
  el.diagnosisPanel.classList.remove('hidden');
  
  // إظهار الإجراءات
  el.actionList.innerHTML = '';
  fault.actions.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act.text;
    li.dataset.correct = act.correct;
    li.addEventListener('mouseenter', () => li.classList.add('hover'));
    li.addEventListener('mouseleave', () => li.classList.remove('hover'));
    el.actionList.appendChild(li);
  });
  
  el.actionPanel.classList.remove('hidden');
}

/* ==================== 2. اختيار الإجراء ==================== */
function checkActionHover(x, y) {
  const items = el.actionList.querySelectorAll('li');
  
  items.forEach(li => {
    const rect = li.getBoundingClientRect();
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    
    if (inside && !li.classList.contains('done')) {
      if (!li.dataset.hoverStart) {
        li.dataset.hoverStart = performance.now();
      }
      const elapsed = performance.now() - li.dataset.hoverStart;
      
      if (elapsed >= 600) { // 0.6 ثانية للاختيار
        executeAction(li);
      }
    } else {
      li.dataset.hoverStart = 0;
    }
  });
}

function executeAction(li) {
  if (li.classList.contains('done')) return;
  li.classList.add('done');

  const isCorrect = li.dataset.correct === 'true';
  
  if (isCorrect) {
    li.classList.add('correct');
    Sound.success();
    showToast('ACTION SUCCESSFUL // FAULT CLEARED');
    Game.score += 200;
    el.hudScore.textContent = Game.score;
    Game.fixedFaults++;
    
    // تصفير الواجهات
    el.diagnosisPanel.classList.add('hidden');
    el.actionPanel.classList.add('hidden');
    el.faultIndicator.classList.add('hidden');
    el.systemStatus.textContent = 'SYSTEM NOMINAL';
    el.systemStatus.className = 'status-ok';
    
    // انتقل للعطل التالي
    setTimeout(spawnFault, 1500);
    
  } else {
    li.classList.add('wrong');
    Sound.error();
    showToast('INVALID ACTION // SYSTEM DAMAGE', true);
    Game.score = Math.max(0, Game.score - 50);
    el.hudScore.textContent = Game.score;
    
    setTimeout(() => {
      li.classList.remove('wrong');
      li.classList.remove('done');
    }, 1000);
  }
}

/* ==================== إنهاء اللعبة ==================== */
function endGame(won) {
  Game.running = false;
  clearInterval(Game.timerInterval);
  
  el.hud.classList.add('hidden');
  el.scene.classList.add('hidden');
  el.fingerCursor.classList.remove('visible');
  
  el.endScreen.classList.remove('hidden');
  
  if (won) {
    el.endTitle.textContent = 'SHIFT COMPLETE // SUCCESS';
    el.endTitle.style.color = 'var(--neon-green)';
  } else {
    el.endTitle.textContent = 'SHIFT FAILED // TIME OUT';
    el.endTitle.style.color = 'var(--neon-red)';
  }
  
  el.finalScore.textContent = Game.score;
  el.finalFixed.textContent = `${Game.fixedFaults} / ${Game.totalFaults}`;
}

/* ==================== الأحداث (Events) ==================== */
el.startBtn.addEventListener('click', startGame);
el.replayBtn.addEventListener('click', () => {
  el.endScreen.classList.add('hidden');
  startGame();
});

el.saveScoreBtn.addEventListener('click', () => {
  const name = el.playerName.value.trim() || 'UNKNOWN';
  console.log('Saved to logs:', name, Game.score);
  showToast('LOG SAVED');
  el.endScreen.classList.add('hidden');
  el.startScreen.classList.remove('hidden');
});

// دعم الماوس (للتسهيل أثناء التطوير)
document.addEventListener('mousemove', (e) => {
  if (!Game.running || Game.fingerActive) return;
  
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = e.clientX + 'px';
  el.fingerCursor.style.top = e.clientY + 'px';
  
  if (Game.faultActive && !Game.diagnosed) {
    checkFaultHover(e.clientX, e.clientY);
  } else if (Game.diagnosed) {
    checkActionHover(e.clientX, e.clientY);
  }
});

document.addEventListener('touchmove', (e) => {
  if (!Game.running || Game.fingerActive) return;
  const t = e.touches[0];
  
  el.fingerCursor.classList.remove('hidden');
  el.fingerCursor.classList.add('visible');
  el.fingerCursor.style.left = t.clientX + 'px';
  el.fingerCursor.style.top = t.clientY + 'px';
  
  if (Game.faultActive && !Game.diagnosed) {
    checkFaultHover(t.clientX, t.clientY);
  } else if (Game.diagnosed) {
    checkActionHover(t.clientX, t.clientY);
  }
}, { passive: true });

console.log('%c⚙️ SOLAR SIMULATOR v6 LOADED', 'color:#00f3ff; font-size:16px; font-weight:bold;');
