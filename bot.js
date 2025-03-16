import { Telegraf } from "telegraf";
import axios from "axios";

const bot = new Telegraf("7206832800:AAGz49EzEKPYz8ae8HJOJ1Klui_fgmng-5w");

// Kanal ID sini aniqlang
const CHANNEL_ID = "@AsilbekCode"; // Kanal username yoki ID

bot.start(async (ctx) => {
  const userId = ctx.from.id; // Foydalanuvchi ID sini olish

  try {
    // Foydalanuvchini kanalga obuna bo'lganligini tekshirish
    const member = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
    const isSubscribed = ["member", "administrator", "creator"].includes(member.status);

    if (!isSubscribed) {
      ctx.reply("Iltimos, kanalga obuna boʻling: https://t.me/AsilbekCode");
      return;
    }

    ctx.reply("Salom! Botga xush kelibsiz.");
  } catch (error) {
    console.error("Xatolik:", error);
    ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  }
});

bot.launch();
console.log("Бот запущен!");