import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Balance = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        setSelectedProduct(null); // Modalni yopish
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

  // Mahsulotlarni kategoriya bo'yicha ajratish
  const shopProducts = products.filter((product) => product.category === "shop");
  const inventoryProducts = products.filter((product) => product.category === "inventory");

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="w-full max-w-4xl p-4">
          <h1 className="text-2xl font-bold mb-6">Магазин</h1>
          <div className="grid grid-cols-2 gap-4">
            {shopProducts.map((product) => (
              <div
                key={product._id}
                className="bg-[#5881d8] rounded-xl p-4 shadow-lg cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center">
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
                  className="w-full bg-white text-center font-bold rounded-lg mt-2 py-2 drop-shadow-[2px_3px_0px_#FF6108]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyProduct(product._id);
                  }}
                  disabled={product.purchased}
                >
                  {product.purchased ? "Куплено" : `Купить (${product.price} танга)`}
                </button>
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold mt-8 mb-6">Инвентарь</h1>
          <div className="grid grid-cols-2 gap-4">
            {inventoryProducts.map((product) => (
              <div
                key={product._id}
                className="bg-[#5881d8] rounded-xl p-4 shadow-lg cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center">
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
                  className="w-full bg-white text-center font-bold rounded-lg mt-2 py-2 drop-shadow-[2px_3px_0px_#FF6108]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyProduct(product._id);
                  }}
                  disabled={product.purchased}
                >
                  {product.purchased ? "Куплено" : `Купить (${product.price} танга)`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal oynasi */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>Цена: {selectedProduct.price} танга</p>
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            )}
            <button
              className="w-full bg-blue-500 text-white font-bold rounded-lg mt-4 py-2 hover:bg-blue-600"
              onClick={() => setSelectedProduct(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Balance;