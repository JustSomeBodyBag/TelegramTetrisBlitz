const tg = window.Telegram.WebApp;

try {
  tg.expand(); // на весь экран
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (user) {
    console.log("User ID:", user.id);
    console.log("Username:", user.username);
  } else {
    console.warn("Telegram initData not available.");
  }
} catch (err) {
  console.error("Telegram WebApp error:", err);
}
