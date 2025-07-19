document.getElementById("menu-button").addEventListener("click", () => {
  window.Telegram.WebApp.showPopup({
    title: "Меню",
    message: "Здесь будет пауза, настройки и донат.",
    buttons: [{ text: "OK", type: "default" }]
  });
});
