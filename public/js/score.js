let score = 0;
let gameOver = false;

export function getScore() {
  return score;
}

export function setScore(newScore) {
  score = newScore;
}

export function updateScore(value) {
  if (gameOver) return;
  score += value;
}

export function getMaxScore() {
  return parseInt(localStorage.getItem('tetrisMaxScore')) || 0;
}

export function setMaxScore(newScore) {
  if (newScore > getMaxScore()) {
    localStorage.setItem('tetrisMaxScore', newScore);
  }
}

export function updateScoreBoard() {
  const scoreBoard = document.getElementById('scoreBoard');
  if (scoreBoard) {
    scoreBoard.textContent = `Счёт: ${score}`;
  }
}

export function updateAllScoreDisplays() {
  const scoreBoard = document.getElementById('scoreBoard');
  if (scoreBoard) scoreBoard.textContent = `Счёт: ${score}`;
  const maxScoreElem = document.getElementById('maxScore');
  if (maxScoreElem) maxScoreElem.textContent = getMaxScore();
  const currentScoreElem = document.getElementById('currentScore');
  if (currentScoreElem) currentScoreElem.textContent = score;
}

// 💥 ДОБАВЬ ЭТУ ФУНКЦИЮ
export function resetScore() {
  score = 0;
}

export function getGameOver() {
  return gameOver;
}

export function setGameOver(value) {
  gameOver = value;
}
