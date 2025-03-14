import React from "react";
import { Link } from "react-router-dom";

const AdminPanelSelector = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-8">Админ Панель</h1>
      <div className="flex gap-4">
        <Link
          to="/admin/tasks"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Задания
        </Link>
        <Link
          to="/admin/products"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Продукты
        </Link>
      </div>
    </div>
  );
};

export default AdminPanelSelector;