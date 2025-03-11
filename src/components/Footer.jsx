import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUserFriends } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import Img1 from '../img/footer/footer-1.png'
import Img2 from '../img/footer/footer-2.png'
import Img3 from '../img/footer/footer-3.png'
import Img4 from '../img/footer/footer-4.png'

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-600 to-[#2e51b7] p-3">
      <div className="flex justify-around items-center text-white gap-[20px]">
        {/* Home */}
        <Link to="/" className="flex flex-col items-center">
          <img className="w-[25px]" src={Img1} alt="img" />
          <span className="text-[10px] mt-1">Главная</span>
        </Link>

        {/* Задания (Tasks) */}
        <Link to="/Tasks" className="flex flex-col items-center">
        <img className="w-[25px]" src={Img2} alt="img" />
          <span className="text-[10px] mt-1">Задания</span>
        </Link>

        {/* Баланс (Balance) */}
        <Link to="/Balance" className="flex flex-col items-center">
        <img className="w-[25px]" src={Img3} alt="img" />
          <span className="text-[10px] mt-1">Баланс</span>
        </Link>

        {/* Пригласить друга (Invite Friend) */}
        <Link to="/Invite" className="flex flex-col items-center">
        <img className="w-[25px]" src={Img4} alt="img" />
          <span className="text-[10px] mt-1">Пригласить друга</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
