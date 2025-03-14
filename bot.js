import { Telegraf } from "telegraf";

const bot = new Telegraf("7206832800:AAGz49EzEKPYz8ae8HJOJ1Klui_fgmng-5w");

bot.start((ctx) => {
  ctx.reply("Привет! Нажми на кнопку ниже, чтобы открыть мини-приложение:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть приложение",
            web_app: { url: "https://leo-coin-omega.vercel.app/" },
          },
        ],
      ],
    },
  });
});

bot.on("web_app_data", (ctx) => {
  const data = ctx.webAppData.data;
  ctx.reply(`Вы отправили данные: ${data}`);
});

bot.launch();
console.log("Бот запущен!");
