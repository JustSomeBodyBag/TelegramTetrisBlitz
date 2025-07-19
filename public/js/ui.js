// В ui.js или прямо в <script>
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menu-button");
  if (!btn) {
    console.error("Menu button not found");
    return;
  }

  btn.addEventListener("click", () => {
    if (window.Telegram?.WebApp?.showPopup) {
      Telegram.WebApp.showPopup({
        title: "Меню",
        message: "Здесь будет пауза, настройки и донат.",
        buttons: [{ text: "OK", type: "default" }]
      });
    } else {
      console.warn("Telegram WebApp not available.");
    }
  });
});
