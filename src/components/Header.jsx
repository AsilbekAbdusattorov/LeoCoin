import React from "react";
import Img1 from '../img/header/header-1.png'
import Img2 from '../img/header/header2.png'

const Header = ({ level }) => {
  return (
    <div className="bg-transparent flex justify-around">
      <div className="flex justify-between items-center">
        <div className="bg-white w-[66px] h-[32.2px] flex justify-center items-center rounded-[5.63px] drop-shadow-[3.22px_4.02px_0px_#FF6108]">
          <div className="flex justify-between items-center">
            <img className="w-[25px] h-[25px]" src={Img2} alt="logo" />
            <h2 className="font-semibold ml-[4px]">{level}</h2>
          </div>
        </div>
        <div className="bg-white w-[66px] h-[32.2px] flex justify-center items-center rounded-[5.63px] drop-shadow-[3.22px_4.02px_0px_#FF6108]">
          <div className="flex justify-between items-center">
            <img className="w-[25px] h-[25px]" src={Img1} alt="logo" />
            <h2 className="font-semibold ml-[4px]">{level}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;