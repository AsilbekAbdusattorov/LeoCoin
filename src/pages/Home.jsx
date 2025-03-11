import React from "react";
import Img1 from '../img/home/home-1.png'
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center mt-6">
        <h2 className="text-white text-center font-medium">LEOcoin’s</h2>
        <p className="text-white text-center font-bold text-[41px]">0</p>

        {/* Progress Bar */}
        <div className="relative w-[296px] mt-4">
          <div className="p-[2px] rounded-[12px]">
            <div className="bg-white w-full h-[27px] rounded-[12px] relative">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[50px] h-[26px] bg-blue-700 rounded-[22px]"
                style={{ width: "51px" }}
              ></div>
            </div>
          </div>
          <p className="absolute right-0 -top-7 text-white text-lg font-bold">
            Уровень <span>1/20</span>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center mt-10">
        <img src={Img1} alt="img" />
      </div>
    </>
  );
};

export default Home;
