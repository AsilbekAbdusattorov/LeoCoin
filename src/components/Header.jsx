import React from "react";
import { Link } from "react-router-dom";
import Img1 from '../img/header/header-1.png'

const Header = () => {
  return (
    <div className="bg-transparent">
      <div className="flex justify-between items-center">
        <div className="flex justify-center rounded-3xl py-[7px] px-3 bg-[#274fbb] border">
          <Link to="/register" className="text-white text-center">X Закрыть</Link>
        </div>
        <div className="bg-white w-[66px] h-[32.2px] flex justify-center items-center rounded-[5.63px] drop-shadow-[3.22px_4.02px_0px_#FF6108]">
          <div className="flex justify-between items-center">
            <img className="w-[25px] h-[25px]" src={Img1} alt="logo" />
            <h2 className="font-semibold ml-[4px]">0</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
