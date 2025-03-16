import { Telegraf } from "telegraf";
import axios from "axios";

const bot = new Telegraf("7206832800:AAGz49EzEKPYz8ae8HJOJ1Klui_fgmng-5w");

// Obuna holatini tekshirish
bot.command("check", async (ctx) => {
  const userId = ctx.from.id; // Foydalanuvchi ID sini olish
  const channelId = ctx.message.text.split(" ")[1]; // Kanal ID sini olish

  if (!channelId) {
    ctx.reply("Iltimos, kanal ID sini kiriting.");
    return;
  }

  try {
    // Foydalanuvchini kanalga obuna bo'lganligini tekshirish
    const member = await ctx.telegram.getChatMember(channelId, userId);
    const isSubscribed = ["member", "administrator", "creator"].includes(member.status);

    if (isSubscribed) {
      ctx.reply("Siz kanalga obuna bo'lgansiz! 🎉");
    } else {
      ctx.reply(`Iltimos, kanalga obuna bo'ling: https://t.me/${channelId}`);
    }
  } catch (error) {
    console.error("Xatolik:", error);
    ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  }
});

bot.launch();
console.log("Бот запущен!");