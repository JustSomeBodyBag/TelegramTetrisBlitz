const tg = window.Telegram.WebApp;
tg.expand(); // разворачивает WebApp
tg.ready();  // уведомляем Telegram, что всё готово

// Пример использования
console.log("User ID:", tg.initDataUnsafe.user?.id);
