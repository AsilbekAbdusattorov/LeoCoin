import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(50);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("shop"); // Default: shop
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

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://leocoin.onrender.com/api/admin/add-product", {
        title,
        description,
        price,
        image,
        category,
      });

      if (response.data.success) {
        setProducts([response.data.product, ...products]);
        setTitle("");
        setDescription("");
        setPrice(50);
        setImage("");
        setCategory("shop");
      }
    } catch (error) {
      setError("Ошибка при добавлении продукта");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Админ Панель (Продукты)</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddProduct} className="mb-6">
        <input
          type="text"
          placeholder="Название продукта"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Описание"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Цена (50 танга)"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ссылка на изображение"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        >
          <option value="shop">Магазин</option>
          <option value="inventory">Инвентарь</option>
        </select>
        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Добавить продукт
        </button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-4">Продукты</h2>
        {products.map((product, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
            <h3 className="font-bold">{product.title}</h3>
            <p>{product.description}</p>
            <p>Цена: {product.price} танга</p>
            <p>Категория: {product.category === "shop" ? "Магазин" : "Инвентарь"}</p>
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;