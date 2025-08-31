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

// Prevent scrolling on mobile
document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// Ensure container stays square
function resizeContainer() {
  const container = document.querySelector('.container');
  container.style.height = `${container.offsetWidth}px`;
}
window.addEventListener('resize', resizeContainer);
window.dispatchEvent(new Event('resize'));

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
    setTimeout(() => { btn.classList.remove('flash'); resolve(); }, 250);
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

  const ranColor = buttons[Math.floor(Math.random() * 4)];
  game.push(ranColor);
  totalMoves = game.length;
  movesLeft = totalMoves;

  for (const color of game) {
    const btn = document.querySelector(`#${color}`);
    await gameFlash(btn);
    await new Promise(r => setTimeout(r, 250));
  }

  updateDisplay();
  isProcessing = false;
  isFlashing = false;
}

function check(index) {
  if (isFlashing) return; // block input during sequence flash

  if (user[index] === game[index]) {
    movesLeft = totalMoves - user.length;
    updateDisplay();

    if (user.length === game.length) {
      // Player completed sequence
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showPopup('Next Level 🎉');

      // Reset flags before next level
      isProcessing = false;
      isFlashing = false;

      setTimeout(levelUp, 1000); // slight delay for popup
    }
  } else {
    // Wrong move
    document.body.classList.add('danger');
    h2.innerHTML = `Game Over! <b>Your score was ${level}</b><br>Press any key, click, or tap to start`;
    showLosePopup('Oops! You Lost 😢 Try Again!');
  }
}

function buttonPress(e) {
  if (!start || isProcessing || isFlashing) return;
  e.preventDefault();
  const btn = this;
  userFlash(btn);
  user.push(btn.getAttribute('id'));
  check(user.length - 1);
}

document.querySelectorAll('.btn').forEach(btn => {
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

  // Add delay before resetting so player sees message
  setTimeout(() => {
    popup.classList.remove('show');
    document.body.classList.remove('lose');
    document.body.classList.remove('danger');
    reset(); // reset after delay
  }, 2000); // 2 seconds delay after loss
}
