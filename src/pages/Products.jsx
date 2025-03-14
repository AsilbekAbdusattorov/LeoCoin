import React, { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://leocoin.onrender.com/api/admin/products");
        setProducts(response.data.products);
      } catch (error) {
        setError("Ошибка при загрузке продуктов");
      }
    };

    fetchProducts();
  }, []);

  const handleBuyProduct = async (productId) => {
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

    try {
      const response = await axios.post("https://leocoin.onrender.com/api/auth/buy-product", {
        email: userEmail,
        productId,
      });

      if (response.data.success) {
        alert("Продукт успешно куплен!");
        setSelectedProduct(null);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Ошибка при покупке продукта");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Магазин</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <h3 className="font-bold">{product.title}</h3>
            <p>{product.description}</p>
            <p>Цена: {product.price} танга</p>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.title}</h2>
            <p>{selectedProduct.description}</p>
            <p>Цена: {selectedProduct.price} танга</p>
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
              onClick={() => handleBuyProduct(selectedProduct._id)}
            >
              Купить
            </button>
            <button
              className="mt-4 ml-2 p-2 bg-gray-500 text-white rounded-lg"
              onClick={() => setSelectedProduct(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;