let game = [];
let user = [];
let start = false;
let level = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let totalMoves = 0;
let movesLeft = 0;
let isProcessing = false;

const buttons = ['red', 'yellow', 'purple', 'green'];
const h2 = document.querySelector('h2');

// Prevent default touch behavior on body to avoid scrolling
document.addEventListener('touchstart', (e) => {
  if (!start) e.preventDefault();
}, { passive: false });

// Start game on keypress, click, or touch
['keypress', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, () => {
    if (!start && !isProcessing) {
      start = true;
      levelUp();
    }
  }, { passive: event === 'touchstart' ? false : true });
});

function gameFlash(btn) {
  btn.classList.add('flash');
  setTimeout(() => btn.classList.remove('flash'), 250);
}

function userFlash(btn) {
  btn.classList.add('userflash');
  setTimeout(() => btn.classList.remove('userflash'), 250);
}

function levelUp() {
  if (isProcessing) return;
  isProcessing = true;
  user = [];
  level++;
  score = level;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  h2.innerText = `Level ${level}`;

  const ranIndex = Math.floor(Math.random() * 4);
  const ranColor = buttons[ranIndex];
  const ranBtn = document.querySelector(`#${ranColor}`);

  game.push(ranColor);
  totalMoves = game.length;
  movesLeft = totalMoves;

  // Flash sequence for all moves in game array
  let flashIndex = 0;
  function flashSequence() {
    if (flashIndex < game.length) {
      const btn = document.querySelector(`#${game[flashIndex]}`);
      gameFlash(btn);
      flashIndex++;
      setTimeout(flashSequence, 500);
    } else {
      isProcessing = false;
    }
  }
  flashSequence();
  updateDisplay();
}

function check(index) {
  if (isProcessing) return;
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
  if (!start || isProcessing) return;
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

// Maintain square container on resize
window.addEventListener('resize', () => {
  const container = document.querySelector('.container');
  container.style.height = `${container.offsetWidth}px`;
});
window.dispatchEvent(new Event('resize'));
