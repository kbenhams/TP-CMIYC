const elementsDOM = {
  startDOM: document.getElementById("start"),
  rotatingDOM: document.getElementById("rotating"),
  scoreDOM: document.getElementById("score"),
  pointsNextDOM: document.getElementById("pointsNext"),
  levelDOM: document.getElementById("level"),
  missDOM: document.getElementById("miss"),
  timerDOM: document.getElementById("timer"),
  jeuDOM: document.getElementById("jeu"),
  hightScoreDOM: document.getElementById("hightscore")
};

const elementsGame = {
  points: 0,
  level: 1,
  pointsNext: 10,
  timer: 60,
  intSecondes: "",
  rotateDur: 2,
  escapeTime: 300,
  missed: 0
};

const gameFuncs = {
  startGame: function() {
    elementsGame.intSecondes = setInterval(function() {
      if (elementsGame.timer == 0) {
        gameOver();
        return;
      }
      elementsGame.timer--;
      elementsDOM.timerDOM.innerText = elementsGame.timer;
    }, 1000);
    elementsDOM.rotatingDOM.style.animationDuration =
      elementsGame.rotateDur + "s";
    elementsDOM.rotatingDOM.addEventListener("mouseover", escape);
    elementsDOM.rotatingDOM.addEventListener("click", addScore);
    elementsDOM.jeuDOM.addEventListener("click", removePointsNext);
  },
  gameOver: function() {
    clearInterval(elementsGame.intSecondes);
    elementsDOM.rotatingDOM.removeEventListener("mouseover", escape);
    elementsDOM.scoreDOM.removeEventListener("click", addScore);
    elementsDOM.jeuDOM.removeEventListener("click", removePointsNext);
    elementsDOM.rotatingDOM.style.animationDuration = "0s";
    elementsDOM.rotatingDOM.style.top = "0px";
    elementsDOM.rotatingDOM.style.left = "0px";
    checkHightScore();
    setTimeout(function() {
      alert("Game OVER");
    }, 2000);
  }
};

var names = [];

var namesJSON = localStorage.getItem("names");
if (namesJSON != null) {
  names = JSON.parse(namesJSON);
  createHightScore();
}

elementsDOM.startDOM.addEventListener("click", gameFuncs.startGame, {
  once: true
});

function gameOver() {}

function escape() {
  setTimeout(function() {
    elementsDOM.rotatingDOM.style.top = Math.floor(Math.random() * 550) + "px";
    elementsDOM.rotatingDOM.style.left = Math.floor(Math.random() * 940) + "px";
  }, elementsGame.escapeTime);
}

function addScore(e) {
  e.stopPropagation();
  elementsGame.points += 10 * elementsGame.level;
  elementsDOM.scoreDOM.innerHTML = elementsGame.points;
  elementsGame.pointsNext--;
  elementsDOM.pointsNextDOM.innerHTML = elementsGame.pointsNext;
  if (elementsGame.pointsNext == 0) {
    nextLevel();
  }
}

function removePointsNext() {
  elementsGame.points -= elementsGame.level;
  elementsDOM.scoreDOM.innerHTML = elementsGame.points;
  elementsGame.missed++;
  elementsDOM.missDOM.innerHTML = elementsGame.missed;
}

function nextLevel() {
  if (elementsGame.level == 5) {
    winGame();
  } else {
    elementsGame.level++;
    elementsDOM.levelDOM.innerHTML = elementsGame.level;
    elementsGame.pointsNext = 10;
    elementsDOM.pointsNextDOM.innerHTML = 10;
    elementsGame.escapeTime -= 50;
    elementsGame.timer += 10;
    elementsDOM.rotatingDOM.style.animationDuration = elementsGame.rotateDur -=
      0.25 + "s";
  }
}

function createHightScore() {
  var toAppend = "";
  names.forEach(name => {
    toAppend += `<div class="users">
    <div class="date">${name.date}</div>
    ${name.user} - ${name.score}
    </div>`;
  });
  elementsDOM.hightScoreDOM.innerHTML = toAppend;
}

function checkHightScore() {
  if (elementsGame.points > names[4].score) {
    names.pop();
    names.push(addUser());
    names.sort((a, b) => {
      return b["score"] - a["score"];
    });
    createHightScore();
  }
  var namesJSON = JSON.stringify(names);
  localStorage.setItem("names", namesJSON);
}

function addUser() {
  var user = {};
  user.user = prompt("Please enter your name : ");
  user.score = elementsGame.points;
  user.date = theDate();
  return user;
}

function theDate() {
  var myDate = new Date();
  var day = myDate.toLocaleDateString();
  return day;
}

function winGame() {
  alert("CONGRATULATIONS !!! YOU WON THE GAME");
  gameOver();
}
