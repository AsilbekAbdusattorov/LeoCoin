import React, { useState, useEffect } from "react";
import Img1 from "../img/home/home-1.png";
import Header from "../components/Header";
import axios from "axios";

const Home = () => {
  const [clickCount, setClickCount] = useState(0);
  const [level, setLevel] = useState(0);
  const [showClickNumber, setShowClickNumber] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [tokens, setTokens] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Foydalanuvchi ma'lumotlarini yuklash
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = JSON.parse(localStorage.getItem("user"))?.email; // LocalStoragedan emailni olish

      if (!userEmail) {
        setError("Foydalanuvchi emaili topilmadi");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          params: { email: userEmail },
        });

        if (response.data.success) {
          const { clickCount, level, tokens } = response.data.user;
          setClickCount(clickCount);
          setLevel(level);
          setTokens(tokens);
        } else {
          setError("Foydalanuvchi ma'lumotlari topilmadi");
        }
      } catch (error) {
        setError(error.response?.data?.error || "Ma'lumotlarni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Click count 1000 ga yetganda levelni oshirish
  useEffect(() => {
    if (clickCount > 0 && clickCount % 1000 === 0) {
      setLevel((prevLevel) => prevLevel + 1);
    }
  }, [clickCount]);

  // Har soatda tokenlarni to'ldirish
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(1000);
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Click bosilganda ishlaydigan funksiya
  const handleClick = async (event) => {
    if (tokens > 0) {
      const newClickCount = clickCount + 1;
      const newTokens = tokens - 1;

      setClickCount(newClickCount);
      setTokens(newTokens);
      setClickPosition({ x: event.clientX, y: event.clientY });
      setShowClickNumber(true);

      setTimeout(() => {
        setShowClickNumber(false);
      }, 1000);

      try {
        const userEmail = JSON.parse(localStorage.getItem("user"))?.email; // LocalStoragedan emailni olish
        await axios.post(
          "http://localhost:5000/api/auth/update",
          {
            email: userEmail, // Foydalanuvchi emailini yuborish
            clickCount: newClickCount,
            level,
            tokens: newTokens,
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Ma'lumotlarni yangilashda xato:", error);
      }
    }
  };

  // Progress bar uchun hisoblar
  const progressWidth = ((clickCount % 1000) / 1000) * 100;
  const tokensWidth = (tokens / 1000) * 100;

  if (loading) {
    return <div className="text-white text-center">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <Header level={level} />
      <div className="flex flex-col items-center justify-center mt-6">
        <h2 className="text-white text-center font-medium mt-10">LEOcoin’s</h2>
        <p className="text-white text-center font-bold text-[41px]">
          {clickCount}
        </p>
        <div className="relative w-[296px] mt-4">
          <div className="p-[2px] rounded-[12px]">
            <div className="bg-white w-full h-[27px] rounded-[12px] relative">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[26px] bg-blue-700 rounded-[22px]"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
          </div>
          <p className="absolute right-0 -top-7 text-white text-lg font-bold">
            Уровень <span>{level}/20</span>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center mt-40">
        <img
          src={Img1}
          alt="img"
          onClick={handleClick}
          style={{
            cursor: tokens > 0 ? "pointer" : "not-allowed",
            borderRadius: "50%",
            transition: "transform 0.1s",
            opacity: tokens > 0 ? 1 : 0.5,
          }}
          className="hover:scale-110 active:scale-95"
        />
      </div>
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-[90%]">
        <p className="text-white text-lg font-bold text-center">
          ⚡ {tokens}/1000
        </p>
        <div className="bg-white w-full h-[20px] rounded-full relative mt-1">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
            style={{ width: `${tokensWidth}%` }}
          ></div>
        </div>
      </div>
      {showClickNumber && (
        <div
          style={{
            position: "absolute",
            left: clickPosition.x,
            top: clickPosition.y,
            color: "black",
            fontSize: "32px",
            fontWeight: "bold",
            animation: "fadeOut 1s forwards",
          }}
        >
          +1
        </div>
      )}
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>
    </>
  );
};

export default Home;