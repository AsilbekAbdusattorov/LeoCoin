import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Img1 from "../img/invite/invite-1.png";
import Img2 from "../img/invite/invite-2.png";
import Img3 from "../img/invite/invite-3.png";

const Invite = () => {
  return (
    <>
      <Header />
      <div className=" flex flex-col items-center p-5">
        {/* Banner qismi */}
        <div className="flex flex-col items-center text-white text-center">
          <div className="flex items-center">
            <img src={Img1} alt="Invite" className="w-[33px] h-[33px]" />
            <img src={Img2} alt="Invite" className="w-[20px] h-2 mx-3" />
            <img src={Img3} alt="Invite" className="w-[38px] h-[38px]" />
          </div>
          <p className="text-lg font-bold mt-[15px] mb-[67px]">
            Приглашай друзей <br /> зарабатывать <br /> LEOcoin's!
          </p>
        </div>

        {/* Referal bo‘limi */}
        <div className="relative bg-[#353535] w-[334px] h-[440px] p-5 rounded-2xl">
          <div className="flex justify-center">
            <h2 className="absolute text-center w-[157px] text-lg font-bold bg-white py-2 rounded-2xl drop-shadow-[4px_7px_0px_#FF6108] -top-5 rotate-[5.3deg]">
              Рефералы
            </h2>
          </div>

          <Link className="flex items-center justify-between bg-[#494949] p-4 rounded-xl mt-10">
            <span className="flex items-center gap-2 text-white font-bold text-[10px]">
              <img src={Img1} alt="img" /> Друзей приглашено{" "}
              <span className="text-2xl ml-5">→</span>
            </span>
            <span className="bg-white text-gray-900 font-bold py-[6px] px-[25px] rounded-lg drop-shadow-[2px_3px_0px_#FF6108]">
              0
            </span>
          </Link>

          <button className="w-full bg-white text-gray-900 font-bold py-3 mt-52 rounded-xl drop-shadow-[2px_3px_0px_#FF6108]">
            Пригласить друга
          </button>
        </div>
      </div>
    </>
  );
};

export default Invite;
