export function setupUIButtons({ onSpawn, onGameOver }) {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const startButton = document.getElementById("startButton");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");
  const gameOverButton = document.getElementById("gameOverButton");

  if (startButton) {
    startButton.addEventListener("click", () => {
      welcomeScreen.style.transition = "transform 0.5s ease, opacity 0.5s ease";
      welcomeScreen.style.transform = "scale(1.1)";
      welcomeScreen.style.opacity = "0";
      setTimeout(() => {
        welcomeScreen.style.display = "none";
      }, 500);
    });
  }

  if (spawnButton) {
    spawnButton.addEventListener("click", () => {
      if (typeof onSpawn === "function") onSpawn();
    });
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "Меню",
          message: "Пауза, настройки, донат",
          buttons: [{ text: "Закрыть", type: "close" }],
        });
      }
    });
  }

  if (gameOverButton) {
    gameOverButton.addEventListener("click", () => {
      if (typeof onGameOver === "function") onGameOver(); // тестовый счёт
    });
  }
}
