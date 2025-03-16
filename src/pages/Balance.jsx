import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import balanceData from "../balance";
import Img1 from "../img/invite/invite-3.png";
import axios from "axios";
import QRCode from "qrcode";

const Balance = () => {
  const [activeTab, setActiveTab] = useState("МАГАЗИН");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(balanceData.products);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    if (!userEmail) {
      console.error("Foydalanuvchi emaili topilmadi. Iltimos, avval tizimga kiring.");
      return;
    }

    axios.get(`https://leocoin.onrender.com/api/auth/user?email=${userEmail}`)
      .then(response => {
        if (response.data.success) {
          setUser(response.data.user);

          // purchasedProducts massiv ekanligini tekshirish
          const purchasedProducts = Array.isArray(response.data.user.purchasedProducts)
            ? response.data.user.purchasedProducts
            : [];

          setProducts(prevProducts => 
            prevProducts.map(product => ({
              ...product,
              purchased: purchasedProducts.includes(product.id), // product.id ni tekshirish
            }))
          );
        } else {
          console.error("Foydalanuvchi ma'lumotlarini yuklashda xato:", response.data.error);
        }
      })
      .catch(error => {
        console.error("Foydalanuvchi ma'lumotlarini yuklashda xato:", error);
      });
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBuyProduct = async (productId, price) => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    if (!userEmail) {
      alert("Foydalanuvchi emaili topilmadi. Iltimos, avval tizimga kiring.");
      return;
    }

    try {
      const response = await axios.post("https://leocoin.onrender.com/api/auth/buy-product", {
        email: userEmail,
        productId,
        price,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId ? { ...product, purchased: true } : product
          )
        );
        setQrCodeUrl(response.data.qrCodeUrl); // QR kodni saqlash
        alert("Mahsulot muvaffaqiyatli sotib olindi!");
      }
    } catch (error) {
      console.error("Mahsulot sotib olishda xato:", error);
      alert(error.response?.data?.error || "Mahsulot sotib olishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };

  return (
    <>
      <Header />
      {/* Top Navigation */}
      <div className="flex justify-center mt-2">
        <div className="flex bg-[#3064d3] p-1 rounded-lg">
          <button
            className={`px-4 py-1 font-bold rounded-lg border-2 ${
              activeTab === "МАГАЗИН"
                ? "bg-white text-[#0101fd] border-[#0101fd]"
                : "bg-transparent text-white border-transparent"
            }`}
            onClick={() => setActiveTab("МАГАЗИН")}
          >
            МАГАЗИН
          </button>
          <button
            className={`px-4 py-1 font-bold rounded-lg border-2 ${
              activeTab === "ИНВЕНТАРЬ"
                ? "bg-[#0101fd] text-white border-[#0101fd]"
                : "bg-transparent text-white border-transparent"
            }`}
            onClick={() => setActiveTab("ИНВЕНТАРЬ")}
          >
            ИНВЕНТАРЬ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center">
        {activeTab === "МАГАЗИН" ? (
          <div className="grid grid-cols-2 mt-3 mb-20 gap-x-5 gap-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[153px] h-[230px] bg-[#5881d8] rounded-xl p-4 shadow-lg"
              >
                <div className="w-[137px] h-[147px] bg-white rounded-lg -ml-2 -mt-2">
                  <img
                    src={product.image}
                    alt={`Product ${product.id}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button className="w-[137px] h-[24px] flex justify-center items-center text-[#0101fd] bg-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FF6108]">
                  <img
                    className="w-[17px] mr-2 h-[17px]"
                    src={Img1}
                    alt="img"
                  />{" "}
                  {product.price}
                </button>
                <button
                  className={`w-[137px] h-[24px] bg-[#0101fd] text-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FFF] ${
                    product.purchased ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    !product.purchased &&
                    handleBuyProduct(product.id, product.price)
                  }
                  disabled={product.purchased}
                >
                  {product.purchased ? "Куплено" : "Купить"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          // ИНВЕНТАРЬ qismi
          <div className="grid grid-cols-2 mt-3 mb-20 gap-x-5 gap-y-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="w-[153px] h-[198px] bg-[#5881d8] rounded-xl p-4 shadow-lg"
              >
                <div className="w-[137px] h-[147px] bg-white rounded-lg -ml-2 -mt-2">
                  <img
                    src={product.image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button
                  className="w-[137px] h-[24px] flex justify-center items-center text-[#0101fd] bg-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FF6108]"
                  onClick={() => openModal(product)}
                >
                  ТВОЙ ТОВАР
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="rounded-2xl p-4 w-11/12 max-w-md relative shadow-lg">
            <button
              className="absolute left-2 bg-gray-200 text-black px-3 py-1 rounded-full text-sm top-[-20px]"
              onClick={closeModal}
            >
              Назад
            </button>

            <div className="flex justify-center bg-white py-[33px] rounded-[20px]">
              <img src={selectedProduct.image} alt="select" />
            </div>

            <p className="text-center text-black bg-white py-3 rounded-[20px] text-sm mt-2">
              {selectedProduct.description}
            </p>

            {qrCodeUrl && (
              <div className="flex justify-center mt-2">
                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
              </div>
            )}

            <div className="flex justify-between items-center mt-2">
              {selectedProduct.purchased ? (
                <button className="w-full h-[24px] bg-[#0101fd] text-white text-center font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FFF]">
                  Проверяй инвентарь :)
                </button>
              ) : (
                <>
                  <button
                    className="w-[137px] h-[24px] bg-[#0101fd] text-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FFF]"
                    onClick={() =>
                      handleBuyProduct(
                        selectedProduct.id,
                        selectedProduct.price
                      )
                    }
                  >
                    Купить
                  </button>
                  <button className="w-[137px] h-[24px] flex justify-center items-center text-[#0101fd] bg-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FF6108]">
                    <img
                      className="w-[17px] mr-2 h-[17px]"
                      src={Img1}
                      alt="img"
                    />{" "}
                    {selectedProduct.price}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Balance;