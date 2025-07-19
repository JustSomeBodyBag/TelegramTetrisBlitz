// Telegram WebApp API инициализация
const tg = window.Telegram.WebApp;

try {
  tg.expand();   // Растянуть WebApp
  tg.ready();    // Уведомить Telegram о готовности

  console.log("[Telegram] Platform:", tg.platform);
  console.log("[Telegram] initData:", tg.initData);

  const user = tg.initDataUnsafe?.user;
  if (user) {
    console.log("✅ User ID:", user.id);
    console.log("✅ Username:", user.username);
  } else {
    console.warn("⚠️ Telegram initData not available.");
    alert("Открой WebApp внутри Telegram для получения данных пользователя.");
  }
} catch (err) {
  console.error("❌ Telegram WebApp error:", err);
}

// Слушатель на кнопку меню
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-button");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      tg.showPopup({
        title: "Меню",
        message: "Здесь будет пауза, настройки и донат.",
        buttons: [{ text: "OK", type: "default" }]
      });
    });
  }
});
