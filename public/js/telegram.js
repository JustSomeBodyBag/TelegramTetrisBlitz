const tg = window.Telegram.WebApp;

try {
  tg.expand();
  tg.ready();

  console.log("[Telegram WebApp] Platform:", tg.platform);
  console.log("[Telegram WebApp] initDataRaw:", tg.initData);

  const user = tg.initDataUnsafe?.user;
  if (user) {
    console.log("✅ User ID:", user.id);
    console.log("✅ Username:", user.username);
  } else {
    console.warn("⚠️ Telegram initData not available.");
    alert("Открой WebApp через Telegram, а не в браузере.");
  }
} catch (err) {
  console.error("❌ Telegram WebApp error:", err);
}
