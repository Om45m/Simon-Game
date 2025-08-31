let game = [];
let user = [];
let start = false;
let level = 0;
let score = 0;
let highScore = localStorage.getItem('simonHighScore') ? parseInt(localStorage.getItem('simonHighScore')) : 0;
let totalMoves = 0;
let movesLeft = 0;
let isProcessing = false;
let isFlashing = false;

const buttons = ['red', 'yellow', 'purple', 'green'];
const h2 = document.querySelector('h2');

// Prevent default touch behavior on body
document.addEventListener('touchstart', (e) => {
  if (!start && e.target.tagName !== 'BUTTON') e.preventDefault();
}, { passive: false });

// Start game on keypress, click, or touch
['keypress', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, (e) => {
    if (!start && !isProcessing && !isFlashing && e.target.tagName !== 'BUTTON') {
      start = true;
      levelUp();
    }
  }, { passive: event === 'touchstart' ? false : true });
});

function gameFlash(btn) {
  return new Promise(resolve => {
    btn.classList.add('flash');
    setTimeout(() => {
      btn.classList.remove('flash');
      resolve();
    }, 250);
  });
}

function userFlash(btn) {
  btn.classList.add('userflash');
  setTimeout(() => btn.classList.remove('userflash'), 250);
}

async function levelUp() {
  if (isProcessing || isFlashing) return;
  isProcessing = true;
  isFlashing = true;
  user = [];
  level++;
  score = level;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('simonHighScore', highScore);
  }

  h2.innerText = `Level ${level}`;

  const ranIndex = Math.floor(Math.random() * 4);
  const ranColor = buttons[ranIndex];
  game.push(ranColor);
  totalMoves = game.length;
  movesLeft = totalMoves;

  // Flash the entire sequence
  for (const color of game) {
    const btn = document.querySelector(`#${color}`);
    await gameFlash(btn);
    await new Promise(resolve => setTimeout(resolve, 250)); // Pause between flashes
  }

  updateDisplay();
  isProcessing = false;
  isFlashing = false;
}

function check(index) {
  if (isProcessing || isFlashing) return;
  isProcessing = true;

  if (user[index] === game[index]) {
    movesLeft = totalMoves - user.length;
    updateDisplay();
    if (user.length === game.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showPopup('Next Level 🎉');
      setTimeout(levelUp, 1500);
    } else {
      isProcessing = false;
    }
  } else {
    h2.innerHTML = `Game Over! <b>Your score was ${level}</b><br>Press any key, click, or tap to start`;
    document.body.classList.add('danger');
    setTimeout(() => document.body.classList.remove('danger'), 500);
    showLosePopup('Oops! You Lost 😢 Try Again!');
    reset();
  }
}

function buttonPress(e) {
  if (!start || isProcessing || isFlashing) return;
  e.preventDefault();
  const btn = this;
  userFlash(btn);
  const userColor = btn.getAttribute('id');
  user.push(userColor);
  check(user.length - 1);
}

const allButtons = document.querySelectorAll('.btn');
allButtons.forEach(btn => {
  btn.addEventListener('click', buttonPress);
  btn.addEventListener('touchstart', buttonPress, { passive: false });
});

function updateDisplay() {
  document.getElementById('score').innerText = score;
  document.getElementById('highScore').innerText = highScore;
  document.getElementById('totalMoves').innerText = totalMoves;
  document.getElementById('movesLeft').innerText = movesLeft;
}

function reset() {
  start = false;
  game = [];
  user = [];
  level = 0;
  score = 0;
  totalMoves = 0;
  movesLeft = 0;
  updateDisplay();
  isProcessing = false;
  isFlashing = false;
}

function showPopup(message) {
  const popup = document.getElementById('nextLevelPopup');
  popup.textContent = message;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 1500);
}

function showLosePopup(message) {
  const popup = document.getElementById('losePopup');
  popup.textContent = message;
  popup.classList.add('show');
  document.body.classList.add('lose');
  setTimeout(() => {
    popup.classList.remove('show');
    document.body.classList.remove('lose');
    isProcessing = false;
  }, 1500);
}

// Maintain square container
window.addEventListener('resize', () => {
  const container = document.querySelector('.container');
  container.style.height = `${container.offsetWidth}px`;
});
window.dispatchEvent(new Event('resize'));
