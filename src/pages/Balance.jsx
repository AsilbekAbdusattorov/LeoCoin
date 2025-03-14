import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Balance = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mahsulotlarni yuklash
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://leocoin.onrender.com/api/admin/products");
        setProducts(response.data.products);
      } catch (error) {
        setError("Ошибка при загрузке продуктов");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mahsulot sotib olish
  const handleBuyProduct = async (productId) => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    try {
      const response = await axios.post("https://leocoin.onrender.com/api/auth/buy-product", {
        email: userEmail,
        productId,
      });

      if (response.data.success) {
        alert("Продукт успешно куплен!");
        // Yangilangan balansni ko'rsatish
        const updatedProducts = products.map((product) =>
          product._id === productId ? { ...product, purchased: true } : product
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Ошибка при покупке продукта");
    }
  };

  if (loading) {
    return <div className="text-white text-center">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="grid grid-cols-2 mt-3 gap-x-5 gap-y-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-[153px] h-[196px] bg-[#5881d8] rounded-xl p-4 shadow-lg"
            >
              <div className="w-[137px] h-[147px] bg-white rounded-lg -ml-2 -mt-2 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-500">Изображение отсутствует</span>
                )}
              </div>
              <button
                className="w-[137px] h-[24px] bg-white text-center -ml-2 font-bold rounded-lg mt-2 drop-shadow-[2px_3px_0px_#FF6108]"
                onClick={() => handleBuyProduct(product._id)}
                disabled={product.purchased}
              >
                {product.purchased ? "Куплено" : `Купить (${product.price} танга)`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Balance;