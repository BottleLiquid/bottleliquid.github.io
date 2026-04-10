const FB = {
  apiKey:            "AIzaSyBgppLaWv-3M9IsCzUtDD5Z8pqUxPtdPLk",
  authDomain:        "liquidtipe.firebaseapp.com",
  projectId:         "liquidtipe",
  storageBucket:     "liquidtipe.firebasestorage.app",
  messagingSenderId: "765092878295",
  appId:             "1:765092878295:web:e63bf4df58cee3141d5d92"
};

let db;
firebase.initializeApp(FB);
db = firebase.firestore();

function getU(){ return localStorage.getItem('lt_u') || null; }
function setU(u){ u ? localStorage.setItem('lt_u',u) : localStorage.removeItem('lt_u'); }
let UC = null;

async function loadUser() {
  const u = getU();
  if (!u) return false;
  const doc = await db.collection('users').doc(u).get();
  if (!doc.exists) { setU(null); return false; }
  UC = doc.data();
  return true;
}

async function saveCoins(newCoins) {
  UC.coins = newCoins;
  await db.collection('users').doc(getU()).update({ coins: newCoins });
  refreshCoins();
}

function refreshCoins() {
  const c = UC ? (UC.coins || 0) : 0;
  document.getElementById('g-coins').textContent = c;
  document.getElementById('nav-coins').textContent = c;
}

function doLogout() {
  setU(null); UC = null;
  window.location.href = 'index.html';
}

let stats = { flips: 0, wins: 0, losses: 0, net: 0 };
let history = [];

function updateStats() {
  document.getElementById('st-flips').textContent = stats.flips;
  document.getElementById('st-wins').textContent = stats.wins;
  document.getElementById('st-losses').textContent = stats.losses;
  const net = stats.net;
  const el = document.getElementById('st-net');
  el.textContent = (net >= 0 ? '+' : '') + net;
  el.className = 'stat-val ' + (net > 0 ? 'green' : net < 0 ? 'red' : 'gold');
}

function addHistory(bet, won) {
  history.unshift({ bet, won });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById('hist-list');
  if (!history.length) { el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:16px;font-size:.85rem">No flips yet</div>'; return; }
  el.innerHTML = history.map(h => `
    <div class="hist-item ${h.won ? 'w' : 'l'}">
      <span class="hist-bet">Bet: 🪙 ${h.bet}</span>
      <span class="hist-result ${h.won ? 'w' : 'l'}">${h.won ? '+' + h.bet + ' 🎉' : '-' + h.bet + ' 💀'}</span>
    </div>
  `).join('');
}

function setBet(n) {
  const max = UC ? (UC.coins || 0) : 0;
  document.getElementById('bet-input').value = Math.min(n, max);
}
function setBetHalf() {
  const max = UC ? (UC.coins || 0) : 0;
  document.getElementById('bet-input').value = Math.max(1, Math.floor(max / 2));
}
function setBetAll() {
  const max = UC ? (UC.coins || 0) : 0;
  document.getElementById('bet-input').value = Math.max(1, max);
}

let isFlipping = false;

async function doFlip() {
  if (isFlipping || !UC) return;

  const bet = parseInt(document.getElementById('bet-input').value) || 0;
  const balance = UC.coins || 0;

  if (bet <= 0) { showToast('Enter a bet amount!'); return; }
  if (bet > balance) { showToast('Not enough coins!'); return; }

  isFlipping = true;
  setButtonsDisabled(true);


  document.getElementById('result-area').innerHTML = '';
  const coinEl = document.getElementById('coin');
  coinEl.className = 'coin';
  coinEl.textContent = '🪙';


  coinEl.classList.add('flipping');

  
  const won = Math.random() < 0.5;

  await new Promise(r => setTimeout(r, 850)); // wait for animation

  coinEl.classList.remove('flipping');
  coinEl.classList.add(won ? 'won' : 'lost');
  coinEl.textContent = won ? '✅' : '❌';

  
  const newCoins = won ? balance + bet : balance - bet;
  await saveCoins(newCoins);

  
  stats.flips++;
  if (won) { stats.wins++; stats.net += bet; }
  else { stats.losses++; stats.net -= bet; }
  updateStats();
  addHistory(bet, won);

  
  const resEl = document.getElementById('result-area');
  if (won) {
    resEl.innerHTML = `<div class="result-txt win">YOU WON!</div><div class="result-sub">+${bet} coins 🎉</div>`;
  } else {
    resEl.innerHTML = `<div class="result-txt lose">YOU LOST</div><div class="result-sub">-${bet} coins 💀</div>`;
  }

 
  setTimeout(() => {
    isFlipping = false;
    setButtonsDisabled(false);
    // If broke, reset bet to 1
    if ((UC.coins || 0) <= 0) {
      showToast('You\'re broke! 😬 Go win some races.');
      document.getElementById('bet-input').value = 0;
    }
  }, 1500);
}

function setButtonsDisabled(d) {
  document.getElementById('flip-btn').disabled = d;
  document.getElementById('bet-input').disabled = d;
  document.querySelectorAll('.qbtn').forEach(b => b.disabled = d);
}


let tTimer = null;
function showToast(msg) {
  let t = document.querySelector('.toast'); if(t) t.remove();
  t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  if(tTimer) clearTimeout(tTimer);
  tTimer = setTimeout(() => t && t.remove(), 2800);
}


async function init() {
  const ok = await loadUser();
  document.getElementById('page-loading').style.display = 'none';

  if (!ok) {
    document.getElementById('not-logged').style.display = 'block';
    document.getElementById('gamble-ui').style.display = 'none';
    return;
  }

  document.getElementById('gamble-ui').style.display = 'flex';
  document.getElementById('not-logged').style.display = 'none';
  document.getElementById('nav-user').textContent = UC.username;
  refreshCoins();
  renderHistory();
  updateStats();
}

init();