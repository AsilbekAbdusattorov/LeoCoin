import React, { useState, useEffect } from "react";
import Img1 from '../img/home/home-1.png';
import Header from "../components/Header";

const Home = () => {
  const [clickCount, setClickCount] = useState(0); // Bosish soni
  const [level, setLevel] = useState(1); // Daraja

  // Har 1000 ta bosishda darajani oshirish
  useEffect(() => {
    if (clickCount > 0 && clickCount % 1000 === 0) {
      setLevel((prevLevel) => prevLevel + 1);
    }
  }, [clickCount]);

  // Rasmga bosilganda bosish sonini oshirish
  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  // Progress bar uchun hisoblash
  const progressWidth = ((clickCount % 1000) / 1000) * 100;

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center mt-6">
        <h2 className="text-white text-center font-medium mt-10">LEOcoin’s</h2>
        <p className="text-white text-center font-bold text-[41px]">{clickCount}</p>
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
        <img src={Img1} alt="img" onClick={handleClick} style={{ cursor: "pointer" }} />
      </div>
    </>
  );
};

export default Home;