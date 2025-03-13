import React, { useState, useEffect } from "react";
import Img1 from "../img/home/home-1.png";
import Header from "../components/Header";

const Home = () => {
  const [clickCount, setClickCount] = useState(0); // Bosish soni
  const [level, setLevel] = useState(0); // Daraja
  const [showClickNumber, setShowClickNumber] = useState(false); // Bosish sonini ko'rsatish
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 }); // Bosish joyi
  const [tokens, setTokens] = useState(1000); // Tokenlar soni

  // Har 1000 ta bosishda darajani oshirish
  useEffect(() => {
    if (clickCount > 0 && clickCount % 1000 === 0) {
      setLevel((prevLevel) => prevLevel + 1);
    }
  }, [clickCount]);

  // Har soatda tokenlarni to‘ldirish
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(1000);
    }, 3600000); // 1 soat = 3600000 ms

    return () => clearInterval(interval);
  }, []);

  // Rasmga bosilganda bosish sonini oshirish va tokenlarni kamaytirish
  const handleClick = (event) => {
    if (tokens > 0) {
      setClickCount((prevCount) => prevCount + 1);
      setTokens((prevTokens) => prevTokens - 1); // Tokenni 1 ga kamaytirish
      setClickPosition({ x: event.clientX, y: event.clientY });
      setShowClickNumber(true);

      // 1 soniyadan keyin bosish sonini yashirish
      setTimeout(() => {
        setShowClickNumber(false);
      }, 1000);
    }
  };

  // Progress bar uchun hisoblash
  const progressWidth = ((clickCount % 1000) / 1000) * 100;
  const tokensWidth = (tokens / 1000) * 100;

  return (
    <>
      <Header />
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
            opacity: tokens > 0 ? 1 : 0.5, // Token tugasa, rasm shaffof bo‘ladi
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
