import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Img1 from "../img/invite/invite-1.png";
import Img2 from "../img/invite/invite-2.png";
import Img3 from "../img/invite/invite-3.png";
import QRCode from "qrcode";
import axios from "axios";

const Invite = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [invitedCount, setInvitedCount] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [referralUsers, setReferralUsers] = useState([]);

  const openModal = () => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;
    if (userEmail) {
      const link = `https://leo-coin-5396.vercel.app/register?ref=${userEmail}`; // Referal link
      setReferralLink(link);
  
      QRCode.toDataURL(link)
        .then(url => {
          setQrCodeUrl(url);
          setIsModalOpen(true);
        })
        .catch(err => {
          console.error("QR kod generatsiyasida xato:", err);
        });
    } else {
      alert("Foydalanuvchi emaili topilmadi. Iltimos, avval tizimga kiring.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDetailsModal = () => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;
    if (userEmail) {
      axios.get(`https://leocoin.onrender.com/api/auth/referral-users?email=${userEmail}`)
        .then(response => {
          if (response.data.success) {
            setReferralUsers(response.data.users);
            setIsDetailsModalOpen(true);
          }
        })
        .catch(error => {
          console.error("Referal foydalanuvchilarini yuklashda xato:", error);
        });
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    if (userEmail) {
      axios.get(`https://leocoin.onrender.com/api/auth/user?email=${userEmail}`)
        .then(response => {
          if (response.data.success) {
            setInvitedCount(response.data.invitedCount);
          }
        })
        .catch(error => {
          console.error("Foydalanuvchi ma'lumotlarini yuklashda xato:", error);
        });
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-5">
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

        <div className="relative bg-[#353535] w-[334px] h-[440px] p-5 rounded-2xl">
          <div className="flex justify-center">
            <h2 className="absolute text-center w-[157px] text-lg font-bold bg-white py-2 rounded-2xl drop-shadow-[4px_7px_0px_#FF6108] -top-5 rotate-[5.3deg]">
              Рефералы
            </h2>
          </div>

          <Link
            onClick={openDetailsModal}
            className="flex items-center justify-between bg-[#494949] p-4 rounded-xl mt-10"
          >
            <span className="flex items-center gap-2 text-white font-bold text-[10px]">
              <img src={Img1} alt="img" /> Друзей приглашено{" "}
              <span className="text-2xl ml-5">→</span>
            </span>
            <span className="bg-white text-gray-900 font-bold py-[6px] px-[25px] rounded-lg drop-shadow-[2px_3px_0px_#FF6108]">
              {invitedCount}
            </span>
          </Link>

          <button
            onClick={openModal}
            className="w-full bg-white text-gray-900 font-bold py-3 mt-52 rounded-xl drop-shadow-[2px_3px_0px_#FF6108]"
          >
            Пригласить друга
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Пригласить друга</h2>
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-gray-700 mb-4">Сканируйте QR-код или отправьте ссылку:</p>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-4">
                <span className="text-gray-700 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {referralLink}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                >
                  Копировать
                </button>
              </div>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {isDetailsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Приглашенные друзья</h2>
              <ul className="text-gray-700 mb-4">
                {referralUsers.map((user, index) => (
                  <li key={index} className="mb-2">
                    {user.name} - {user.email}
                  </li>
                ))}
              </ul>
              <button
                onClick={closeDetailsModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Invite;