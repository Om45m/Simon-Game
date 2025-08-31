let game = [];
let user = [];
let start = false;
let level = 0;
let score = 0;
let highScore = 0;
let totalMoves = 0;
let movesLeft = 0;

let buttons = ['yellow','red','green','purple'];
let h2 = document.querySelector('h2');

// Start game on key, click or tap
["keypress", "click", "touchstart"].forEach(event => {
    document.addEventListener(event, () => {
        if (!start) {
            start = true;
            levelup();
        }
    });
});

function gameflash(btn) {
    btn.classList.add('flash');
    setTimeout(() => btn.classList.remove('flash'), 250);
}

function userflash(btn) {
    btn.classList.add('userflash');
    setTimeout(() => btn.classList.remove('userflash'), 250);
}

function levelup(){
    user = [];
    level++;
    score = level;
    if (score > highScore) highScore = score;

    h2.innerText = `Level ${level}`;

    let rani = Math.floor(Math.random()*4);
    let rancolor = buttons[rani];
    let ranbtn = document.querySelector(`.${rancolor}`);

    game.push(rancolor);
    totalMoves = game.length;
    movesLeft = totalMoves;

    gameflash(ranbtn);
    updateDisplay();
}

function check(index){
    if(user[index]==game[index]){
        movesLeft = totalMoves - user.length;
        updateDisplay();
        if(user.length == game.length){
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            showPopup("Next Level 🚀");
            setTimeout(levelup,1000);
        }
    } else {
        h2.innerHTML = `Game Over! <b>Your score was ${level}</b><br>Press any key, click or tap to start`;
        document.body.classList.add("danger");
        setTimeout(() => document.body.classList.remove("danger"), 500);
        showLosePopup("Oops! You Lost 😢 Try Again!");
        reset();
    }
}

function buttonpress(){
    let btn = this;
    userflash(btn);
    let usercolor = btn.getAttribute('id');
    user.push(usercolor);
    check(user.length-1);
}

let allbutton = document.querySelectorAll('.btn');
for (let btn of allbutton){
    btn.addEventListener('click',buttonpress);
    btn.addEventListener('touchstart',buttonpress);
}

function updateDisplay() {
    document.getElementById("score").innerText = score;
    document.getElementById("highScore").innerText = highScore;
    document.getElementById("totalMoves").innerText = totalMoves;
    document.getElementById("movesLeft").innerText = movesLeft;
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
}

function showPopup(message) {
    const popup = document.getElementById("nextLevelPopup");
    popup.textContent = message;
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 1500);
}

function showLosePopup(message) {
    const popup = document.getElementById("losePopup");
    popup.textContent = message;
    popup.classList.add("show");
    document.body.classList.add("lose");
    setTimeout(() => {
        popup.classList.remove("show");
        document.body.classList.remove("lose");
    }, 1500);
}
