// ========================================
//   NUTRITRACK — app.js
// ========================================

// ---- State ----
const TODAY = new Date().toISOString().slice(0, 10);

const defaultGoals = {
  calories: 2000, protein: 60, carbs: 250,
  fat: 65, fiber: 30, water: 8
};

let state = {
  goals: { ...defaultGoals },
  entries: [],   // today's food entries
  waterLog: [],  // today's water logs
  history: {}    // past days: { "YYYY-MM-DD": { totals, entries, water } }
};

// ---- Food Database ----
const FOOD_DB = [
  { name: "Apple (medium)", cal: 95,  pro: 0.5, carb: 25, fat: 0.3, fiber: 4.4, vitC: 8.4, calcium: 11,  iron: 0.2, sodium: 2,   potassium: 195, vitD: 0 },
  { name: "Banana (medium)", cal: 105, pro: 1.3, carb: 27, fat: 0.4, fiber: 3.1, vitC: 10.3,calcium: 6,   iron: 0.3, sodium: 1,   potassium: 422, vitD: 0 },
  { name: "Boiled Egg",      cal: 78,  pro: 6,   carb: 0.6,fat: 5,   fiber: 0,   vitC: 0,   calcium: 25,  iron: 0.6, sodium: 62,  potassium: 63,  vitD: 1.1},
  { name: "Chicken Breast (100g)", cal: 165, pro: 31, carb: 0, fat: 3.6, fiber: 0, vitC: 0, calcium: 15, iron: 1,   sodium: 74,  potassium: 256, vitD: 0.1},
  { name: "Brown Rice (1 cup)", cal: 216, pro: 5, carb: 45, fat: 1.8, fiber: 3.5, vitC: 0, calcium: 20,  iron: 1,   sodium: 10,  potassium: 154, vitD: 0},
  { name: "Spinach (100g)",  cal: 23,  pro: 2.9, carb: 3.6,fat: 0.4, fiber: 2.2, vitC: 28.1,calcium: 99, iron: 2.7, sodium: 79,  potassium: 558, vitD: 0},
  { name: "Whole Milk (1 cup)", cal: 149, pro: 8, carb: 11.7, fat: 8, fiber: 0, vitC: 0, calcium: 276, iron: 0, sodium: 105, potassium: 366, vitD: 3.2},
  { name: "Orange (medium)", cal: 62,  pro: 1.2, carb: 15.4, fat: 0.2, fiber: 3.1, vitC: 69.7, calcium: 52, iron: 0.1, sodium: 0, potassium: 237, vitD: 0},
  { name: "Salmon (100g)",   cal: 208, pro: 20,  carb: 0,  fat: 13,  fiber: 0,   vitC: 0,   calcium: 12,  iron: 0.8, sodium: 59,  potassium: 363, vitD: 11},
  { name: "Oats (1 cup dry)", cal: 307, pro: 11, carb: 55, fat: 5,   fiber: 8.2, vitC: 0,   calcium: 43,  iron: 3.7, sodium: 6,   potassium: 335, vitD: 0},
  { name: "Greek Yogurt (1 cup)", cal: 130, pro: 17, carb: 9, fat: 3, fiber: 0, vitC: 1.2, calcium: 189, iron: 0.1, sodium: 95, potassium: 240, vitD: 0},
  { name: "Avocado (half)", cal: 120, pro: 1.5, carb: 6.4, fat: 11, fiber: 5, vitC: 7.5, calcium: 12, iron: 0.4, sodium: 6, potassium: 487, vitD: 0},
  { name: "Broccoli (1 cup)", cal: 55, pro: 3.7, carb: 11, fat: 0.6, fiber: 5.1, vitC: 81.2, calcium: 43, iron: 0.7, sodium: 64, potassium: 288, vitD: 0},
  { name: "Sweet Potato (medium)", cal: 103, pro: 2.3, carb: 24, fat: 0.1, fiber: 3.8, vitC: 22, calcium: 43, iron: 0.8, sodium: 41, potassium: 438, vitD: 0},
  { name: "Almonds (30g)",   cal: 173, pro: 6,   carb: 6,  fat: 15,  fiber: 3.5, vitC: 0,   calcium: 76,  iron: 1,   sodium: 0,   potassium: 208, vitD: 0},
  { name: "White Rice (1 cup)", cal: 206, pro: 4.3, carb: 44, fat: 0.4, fiber: 0.6, vitC: 0, calcium: 16, iron: 1.9, sodium: 2, potassium: 55, vitD: 0},
  { name: "Lentils (1 cup cooked)", cal: 230, pro: 17.9, carb: 39.9, fat: 0.8, fiber: 15.6, vitC: 3, calcium: 38, iron: 6.6, sodium: 4, potassium: 731, vitD: 0},
  { name: "Cheddar Cheese (30g)", cal: 113, pro: 7, carb: 0.4, fat: 9.3, fiber: 0, vitC: 0, calcium: 202, iron: 0.2, sodium: 185, potassium: 27, vitD: 0.1},
  { name: "Tofu (100g)",     cal: 76,  pro: 8,   carb: 1.9,fat: 4.8, fiber: 0.3, vitC: 0.1, calcium: 350, iron: 5.4, sodium: 7,   potassium: 121, vitD: 0},
  { name: "Coffee (black, 1 cup)", cal: 5, pro: 0.3, carb: 0, fat: 0, fiber: 0, vitC: 0, calcium: 5, iron: 0.1, sodium: 5, potassium: 116, vitD: 0},
  { name: "Orange Juice (1 cup)", cal: 111, pro: 1.7, carb: 26, fat: 0.5, fiber: 0.5, vitC: 97, calcium: 27, iron: 0.5, sodium: 2, potassium: 496, vitD: 0},
  { name: "Bread (whole wheat, 1 slice)", cal: 69, pro: 3.6, carb: 12, fat: 1, fiber: 1.9, vitC: 0, calcium: 24, iron: 1, sodium: 132, potassium: 71, vitD: 0},
];

// ---- Health Tips ----
const TIPS = [
  "🥦 Great job logging! Try to include a leafy green in your next meal.",
  "💪 You're tracking protein well! Aim for protein with every meal.",
  "🌾 Fiber helps with digestion. Fruits, veggies & whole grains are great sources.",
  "🧂 Watch sodium intake — high levels can raise blood pressure.",
  "🐟 Fatty fish like salmon are excellent sources of Vitamin D and Omega-3.",
  "🥑 Healthy fats (avocado, nuts, olive oil) support brain and heart health.",
  "☀️ Most people are Vitamin D deficient — consider sunlight exposure daily.",
  "🧡 Orange and yellow foods are rich in Vitamin C & beta-carotene.",
  "⚡ Low on iron? Try pairing plant-based iron with Vitamin C for better absorption.",
  "🫀 Potassium helps regulate blood pressure — bananas, spinach & beans are great.",
];

// ---- Init ----
function init() {
  loadState();
  setHeaderDate();
  setupTabs();
  setupFoodLog();
  setupWater();
  setupGoals();
  setupHistory();
  updateDashboard();
  renderEntries();
  renderWaterLog();
}

// ---- Load / Save ----
function loadState() {
  try {
    const saved = localStorage.getItem('nutritrack');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      // Reset today's entries if date changed
      if (state.lastDate !== TODAY) {
        // Archive yesterday
        if (state.lastDate && (state.entries.length > 0 || state.waterLog.length > 0)) {
          archiveDay(state.lastDate);
        }
        state.entries = [];
        state.waterLog = [];
        state.lastDate = TODAY;
        saveState();
      }
    } else {
      state.lastDate = TODAY;
      saveState();
    }
    // Load goals form
    document.getElementById('goalCalories').value = state.goals.calories;
    document.getElementById('goalProtein').value  = state.goals.protein;
    document.getElementById('goalCarbs').value    = state.goals.carbs;
    document.getElementById('goalFat').value      = state.goals.fat;
    document.getElementById('goalFiber').value    = state.goals.fiber;
    document.getElementById('goalWater').value    = state.goals.water;
  } catch(e) { console.warn('State load error', e); }
}

function saveState() {
  try { localStorage.setItem('nutritrack', JSON.stringify(state)); } catch(e) {}
}

function archiveDay(date) {
  const totals = calcTotals();
  const water  = state.waterLog.reduce((s, w) => s + w.amount, 0);
  state.history[date] = {
    totals,
    water,
    entries: [...state.entries],
    waterLog: [...state.waterLog]
  };
}

// ---- Date ----
function setHeaderDate() {
  const el = document.getElementById('headerDate');
  const d = new Date();
  el.textContent = d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

// ---- Tabs ----
function setupTabs() {
  const btns  = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      if (tab === 'history') renderHistory();
    });
  });
}

// ---- Totals ----
function calcTotals() {
  return state.entries.reduce((acc, e) => {
    acc.calories  += e.cal || 0;
    acc.protein   += e.pro || 0;
    acc.carbs     += e.carb || 0;
    acc.fat       += e.fat || 0;
    acc.fiber     += e.fiber || 0;
    acc.vitC      += e.vitC || 0;
    acc.calcium   += e.calcium || 0;
    acc.iron      += e.iron || 0;
    acc.sodium    += e.sodium || 0;
    acc.potassium += e.potassium || 0;
    acc.vitD      += e.vitD || 0;
    return acc;
  }, { calories:0, protein:0, carbs:0, fat:0, fiber:0, vitC:0, calcium:0, iron:0, sodium:0, potassium:0, vitD:0 });
}

function calcWaterTotal() {
  return state.waterLog.reduce((s, w) => s + w.amount, 0);
}

// ---- Dashboard Update ----
function updateDashboard() {
  const t = calcTotals();
  const g = state.goals;
  const w = calcWaterTotal();

  // Cards
  setCard('dashCalories', 'ringCalories', t.calories, g.calories, 'dashCaloriesGoal');
  setCard('dashProtein',  'ringProtein',  t.protein,  g.protein,  'dashProteinGoal');
  setCard('dashCarbs',    'ringCarbs',    t.carbs,    g.carbs,    'dashCarbsGoal');
  setCard('dashFat',      'ringFat',      t.fat,      g.fat,      'dashFatGoal');
  setCard('dashFiber',    'ringFiber',    t.fiber,    g.fiber,    'dashFiberGoal');

  // Water
  const wg = g.water;
  document.getElementById('dashWater').textContent = round(w);
  document.getElementById('dashWaterGoal').textContent = wg;
  const waterPct = Math.min(w / wg, 1) * 100;
  document.getElementById('waterFill').style.height = waterPct + '%';

  // Macro bar
  const total = t.protein + t.carbs + t.fat;
  if (total > 0) {
    document.getElementById('segProtein').style.width = (t.protein / total * 100) + '%';
    document.getElementById('segCarbs').style.width   = (t.carbs / total * 100) + '%';
    document.getElementById('segFat').style.width     = (t.fat / total * 100) + '%';
  }

  // Micros
  setMicro('microVitC', 'valVitC', t.vitC, 90);
  setMicro('microCalcium', 'valCalcium', t.calcium, 1000);
  setMicro('microIron', 'valIron', t.iron, 18);
  setMicro('microSodium', 'valSodium', t.sodium, 2300);
  setMicro('microPotassium', 'valPotassium', t.potassium, 3500);
  setMicro('microVitD', 'valVitD', t.vitD, 20);

  // Tip
  if (state.entries.length > 0) {
    const tipEl = document.getElementById('tipText');
    tipEl.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
  }
}

function setCard(valId, ringId, val, goal, goalId) {
  document.getElementById(valId).textContent = round(val);
  if (goalId) document.getElementById(goalId).textContent = goal;
  if (ringId) {
    const pct = Math.min(val / goal, 1);
    const circ = 213.6;
    const offset = circ - pct * circ;
    document.getElementById(ringId).style.strokeDashoffset = offset;
  }
}

function setMicro(barId, valId, val, goal) {
  const pct = Math.min(val / goal * 100, 100);
  document.getElementById(barId).style.width = pct + '%';
  document.getElementById(valId).textContent = round(val);
}

function round(v) { return Math.round(v * 10) / 10; }

// ---- Food Log ----
function setupFoodLog() {
  // Search
  document.getElementById('searchBtn').addEventListener('click', searchFood);
  document.getElementById('foodSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchFood();
  });

  // Add food button
  document.getElementById('addFoodBtn').addEventListener('click', addCustomFood);
}

function searchFood() {
  const q = document.getElementById('foodSearch').value.trim().toLowerCase();
  const results = document.getElementById('searchResults');
  results.innerHTML = '';
  if (!q) { results.innerHTML = '<div class="empty-state">Type a food name to search.</div>'; return; }

  const matches = FOOD_DB.filter(f => f.name.toLowerCase().includes(q));
  if (!matches.length) {
    results.innerHTML = '<div class="empty-state">No results. Try a different term.</div>';
    return;
  }
  matches.forEach(f => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.innerHTML = `
      <div>
        <div class="sri-name">${f.name}</div>
        <div class="sri-info">${f.cal} kcal · P:${f.pro}g · C:${f.carb}g · F:${f.fat}g</div>
      </div>
      <button class="sri-add" title="Add to log">+</button>
    `;
    item.querySelector('.sri-add').addEventListener('click', () => {
      const meal = document.getElementById('mealType').value;
      addEntry({ ...f, meal });
      showToast(`Added: ${f.name}`);
    });
    results.appendChild(item);
  });
}

function addCustomFood() {
  const name = document.getElementById('foodName').value.trim();
  const cal  = parseFloat(document.getElementById('entryCalories').value) || 0;
  const msg  = document.getElementById('formMsg');

  if (!name) { showMsg(msg, 'error', 'Please enter a food name.'); return; }
  if (!cal)  { showMsg(msg, 'error', 'Please enter calories.'); return; }

  const meal = document.getElementById('mealType').value;
  addEntry({
    name, meal, cal,
    pro:       parseFloat(document.getElementById('entryProtein').value) || 0,
    carb:      parseFloat(document.getElementById('entryCarbs').value)   || 0,
    fat:       parseFloat(document.getElementById('entryFat').value)     || 0,
    fiber:     parseFloat(document.getElementById('entryFiber').value)   || 0,
    vitC:      parseFloat(document.getElementById('entryVitC').value)    || 0,
    calcium:   parseFloat(document.getElementById('entryCalcium').value) || 0,
    iron:      parseFloat(document.getElementById('entryIron').value)    || 0,
    sodium:    parseFloat(document.getElementById('entrySodium').value)  || 0,
    potassium: parseFloat(document.getElementById('entryPotassium').value)|| 0,
    vitD:      parseFloat(document.getElementById('entryVitD').value)    || 0,
  });

  showMsg(msg, 'success', `✓ ${name} added to your log!`);
  clearLogForm();
  setTimeout(() => msg.classList.add('hidden'), 3000);
}

function addEntry(food) {
  const entry = { ...food, id: Date.now(), time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit'}) };
  state.entries.push(entry);
  saveState();
  renderEntries();
  updateDashboard();
}

function renderEntries() {
  const list = document.getElementById('entriesList');
  const count = document.getElementById('entryCount');
  list.innerHTML = '';
  count.textContent = `${state.entries.length} item${state.entries.length !== 1 ? 's' : ''}`;
  if (!state.entries.length) {
    list.innerHTML = '<div class="empty-state">No food logged yet today. Start by adding a meal above!</div>';
    return;
  }
  // Group by meal
  const groups = {};
  state.entries.forEach(e => {
    if (!groups[e.meal]) groups[e.meal] = [];
    groups[e.meal].push(e);
  });
  const order = ['Breakfast','Lunch','Dinner','Snack'];
  order.forEach(meal => {
    if (!groups[meal]) return;
    groups[meal].forEach(e => {
      const item = document.createElement('div');
      item.className = 'entry-item';
      item.innerHTML = `
        <span class="entry-meal-badge">${e.meal}</span>
        <div style="flex:1">
          <div class="entry-name">${e.name}</div>
          <div class="entry-macros">P:${round(e.pro)}g · C:${round(e.carb)}g · F:${round(e.fat)}g · Fiber:${round(e.fiber)}g</div>
        </div>
        <div class="entry-cal">${round(e.cal)} kcal</div>
        <button class="entry-delete" data-id="${e.id}" title="Remove">✕</button>
      `;
      item.querySelector('.entry-delete').addEventListener('click', () => deleteEntry(e.id));
      list.appendChild(item);
    });
  });
}

function deleteEntry(id) {
  state.entries = state.entries.filter(e => e.id !== id);
  saveState();
  renderEntries();
  updateDashboard();
  showToast('Entry removed');
}

function clearLogForm() {
  ['foodName','entryCalories','entryProtein','entryCarbs','entryFat',
   'entryFiber','entryVitC','entryCalcium','entryIron','entrySodium',
   'entryPotassium','entryVitD'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function showMsg(el, type, text) {
  el.textContent = text;
  el.className = `form-msg ${type}`;
  el.classList.remove('hidden');
}

// ---- Water ----
function setupWater() {
  document.querySelectorAll('.glass-btn').forEach(btn => {
    btn.addEventListener('click', () => addWater(parseFloat(btn.dataset.amt)));
  });
  document.getElementById('addCustomWater').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('customWater').value);
    if (val > 0) { addWater(val); document.getElementById('customWater').value = ''; }
    else showToast('Enter a valid water amount');
  });
  document.getElementById('resetWater').addEventListener('click', () => {
    state.waterLog = [];
    saveState();
    updateWaterDisplay();
    renderWaterLog();
    updateDashboard();
    showToast('Water log reset');
  });
  updateWaterDisplay();
}

function addWater(amount) {
  state.waterLog.push({ amount, time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit'}) });
  saveState();
  updateWaterDisplay();
  renderWaterLog();
  updateDashboard();
  showToast(`+${amount} glass${amount !== 1 ? 'es' : ''} logged 💧`);
}

function updateWaterDisplay() {
  const total = calcWaterTotal();
  const goal  = state.goals.water;
  const pct   = Math.min(total / goal * 100, 100);
  document.getElementById('bottleFill').style.height = pct + '%';
  document.getElementById('bottlePct').textContent = Math.round(pct) + '%';
  document.getElementById('waterCount').textContent = round(total);
  document.getElementById('waterGoalDisp').textContent = goal;
}

function renderWaterLog() {
  const list = document.getElementById('waterLogList');
  list.innerHTML = '';
  if (!state.waterLog.length) {
    list.innerHTML = '<div class="empty-state">No water logged yet.</div>';
    return;
  }
  [...state.waterLog].reverse().forEach(w => {
    const item = document.createElement('div');
    item.className = 'water-log-item';
    item.innerHTML = `
      <span class="water-log-icon">💧</span>
      <span class="water-log-amt">${w.amount} glass${w.amount !== 1 ? 'es' : ''}</span>
      <span class="water-log-time">${w.time}</span>
    `;
    list.appendChild(item);
  });
}

// ---- Goals ----
function setupGoals() {
  document.getElementById('editGoalsBtn').addEventListener('click', () => {
    document.getElementById('goalsForm').classList.toggle('hidden');
  });
  document.getElementById('saveGoalsBtn').addEventListener('click', () => {
    state.goals = {
      calories: parseInt(document.getElementById('goalCalories').value) || defaultGoals.calories,
      protein:  parseInt(document.getElementById('goalProtein').value)  || defaultGoals.protein,
      carbs:    parseInt(document.getElementById('goalCarbs').value)    || defaultGoals.carbs,
      fat:      parseInt(document.getElementById('goalFat').value)      || defaultGoals.fat,
      fiber:    parseInt(document.getElementById('goalFiber').value)    || defaultGoals.fiber,
      water:    parseInt(document.getElementById('goalWater').value)    || defaultGoals.water,
    };
    saveState();
    updateDashboard();
    updateWaterDisplay();
    document.getElementById('goalsForm').classList.add('hidden');
    showToast('Goals updated ✓');
  });
}

// ---- History ----
function setupHistory() {
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Clear all history? This cannot be undone.')) {
      state.history = {};
      saveState();
      renderHistory();
      showToast('History cleared');
    }
  });
}

function renderHistory() {
  const chart   = document.getElementById('historyChart');
  const labels  = document.getElementById('chartLabels');
  const table   = document.getElementById('historyTable');
  chart.innerHTML = '';
  labels.innerHTML = '';
  table.innerHTML = '';

  // Build 7-day window (today included)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday:'short' });
    let cal = 0, pro = 0, carb = 0, fat = 0, water = 0;
    if (key === TODAY) {
      const t = calcTotals();
      cal = t.calories; pro = t.protein; carb = t.carbs; fat = t.fat;
      water = calcWaterTotal();
    } else if (state.history[key]) {
      const h = state.history[key];
      cal = h.totals.calories; pro = h.totals.protein;
      carb = h.totals.carbs;   fat = h.totals.fat;
      water = h.water || 0;
    }
    days.push({ key, label, cal, pro, carb, fat, water });
  }

  const maxCal = Math.max(...days.map(d => d.cal), 1);

  days.forEach(d => {
    const pct = (d.cal / maxCal * 100);
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = Math.max(pct, 2) + '%';
    bar.innerHTML = `<div class="chart-bar-tip">${Math.round(d.cal)} kcal</div>`;
    chart.appendChild(bar);

    const lbl = document.createElement('div');
    lbl.className = 'chart-label';
    lbl.textContent = d.label;
    labels.appendChild(lbl);
  });

  // Table
  days.forEach(d => {
    const isToday = d.key === TODAY;
    const block = document.createElement('div');
    block.className = 'history-day';
    const dateLabel = isToday ? 'Today' : new Date(d.key + 'T00:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric' });

    if (d.cal === 0 && d.water === 0) {
      block.innerHTML = `
        <div class="history-day-header">${dateLabel}</div>
        <div class="empty-state" style="padding:16px 0;">No data recorded.</div>
      `;
    } else {
      block.innerHTML = `
        <div class="history-day-header">${dateLabel}</div>
        <div class="entry-item">
          <span class="entry-meal-badge">Summary</span>
          <div style="flex:1">
            <div class="entry-name">Nutrition</div>
            <div class="entry-macros">Protein:${round(d.pro)}g · Carbs:${round(d.carb)}g · Fat:${round(d.fat)}g · Water:${round(d.water)} glasses</div>
          </div>
          <div class="entry-cal">${Math.round(d.cal)} kcal</div>
        </div>
      `;
    }
    table.appendChild(block);
  });
}

// ---- Toast ----
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
