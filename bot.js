import { Telegraf } from "telegraf";
import axios from "axios";

const bot = new Telegraf("7206832800:AAGz49EzEKPYz8ae8HJOJ1Klui_fgmng-5w");

bot.start((ctx) => {
  const startPayload = ctx.startPayload; // `?start=` dan keyingi qism (userEmail)
  const userId = ctx.from.id; // Foydalanuvchi ID sini olish

  if (startPayload) {
    // Referal link orqali kelgan foydalanuvchi
    const referrerEmail = startPayload;

    // Backendga so'rov yuborish
    axios.post("https://leocoin.onrender.com/api/auth/handle-referral", {
      referrerEmail: referrerEmail,
      newUserId: userId,
    })
    .then(response => {
      if (response.data.success) {
        ctx.reply(`Siz ${referrerEmail} orqali ro'yxatdan o'tdingiz. 1 LEO tanga qo'shildi!`);
      } else {
        ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      }
    })
    .catch(error => {
      console.error("Xatolik:", error);
      ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    });
  } else {
    // Oddiy start bosgan foydalanuvchi
    ctx.reply("Salom! Botga xush kelibsiz.");
  }
});

bot.launch();
console.log("Бот запущен!");