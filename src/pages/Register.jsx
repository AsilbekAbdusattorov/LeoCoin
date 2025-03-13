import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsRegistered }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 📌 Telefon formatini avtomatik to'g'irlash
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("998")) value = value.slice(3);

    let formatted = "+998";
    if (value.length > 0) formatted += `-(${value.slice(0, 2)})`;
    if (value.length > 2) formatted += `-${value.slice(2, 5)}`;
    if (value.length > 5) formatted += `-${value.slice(5, 7)}`;
    if (value.length > 7) formatted += `-${value.slice(7, 9)}`;

    setPhone(formatted);
  };

  const handlePhoneFocus = () => {
    if (!phone) setPhone("+998-");
  };

  // 📌 Formani yuborish funksiyasi
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Ro'yxatdan o'tganligini saqlash
    localStorage.setItem("registered", "true");
    setIsRegistered(true);

    setTimeout(() => navigate("/home"), 500);
  };

  // 📌 Forma to'liq to'ldirilganligini tekshirish
  const isFormValid =
    name.trim().length > 0 &&
    phone.length === 19 &&
    email.includes("@") &&
    email.includes(".");

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <div className="bg-[#4365c1] p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-center text-lg font-bold mb-4 text-white">
          Оставьте свои контакты, <br /> чтобы продолжить
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Телефон"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-lg"
            value={phone}
            onChange={handlePhoneChange}
            onFocus={handlePhoneFocus}
            maxLength="19"
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white text-lg font-bold ${
              isFormValid ? "bg-blue-500" : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            {loading ? "Загрузка..." : "ОТПРАВИТЬ"}
          </button>
        </form>
        <p className="text-xs text-center text-white mt-3">
          Нажимая кнопку «Отправить» я соглашаюсь <br />
          <a href="#" className="text-white">
            с <span className="border-b"> политикой конфиденциальности</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
