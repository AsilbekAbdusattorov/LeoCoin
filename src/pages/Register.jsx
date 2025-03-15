import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Register = ({ setIsRegistered }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Telefon raqamni faqat raqamlarga aylantirish
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Faqat raqamlarni qoldiradi
    setPhone(value);
  };

  // Formani yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const referralCode = new URLSearchParams(location.search).get("ref");
  
    const formData = {
      name,
      phone,
      email,
      referralCode,
    };
  
    console.log("Yuborilayotgan ma'lumotlar:", formData); // Ma'lumotlarni konsolga chiqarish
  
    try {
      const response = await axios.post(
        "https://leocoin.onrender.com/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        localStorage.setItem("registered", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        if (response.data.user.isAdmin) {
          navigate("/admindashboard");
        } else {
          setIsRegistered(true);
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error); // Xatolikni konsolga chiqarish
      setError(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Formani to'g'riligini tekshirish
  const isFormValid =
    name.trim().length > 0 && // Ism bo'sh bo'lmasligi kerak
    phone.length >= 9 && // Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak
    email.includes("@") && // Emailda @ belgisi bo'lishi kerak
    email.includes("."); // Emailda . belgisi bo'lishi kerak

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <div className="bg-[#4365c1] p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-center text-lg font-bold mb-4 text-white">
          Оставьте свои контакты, <br /> чтобы продолжить
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // Majburiy maydon
          />
          <input
            type="tel"
            placeholder="Телефон"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-lg"
            value={phone}
            onChange={handlePhoneChange}
            maxLength="15" // Maksimal uzunlik
            required // Majburiy maydon
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Majburiy maydon
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