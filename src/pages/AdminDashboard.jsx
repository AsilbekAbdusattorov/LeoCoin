import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [ads, setAds] = useState([]); // Reklamalar uchun state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState(0);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("https://leocoin.onrender.com/api/admin/tasks");
        setTasks(response.data.tasks);
      } catch (error) {
        setError("Ошибка при загрузке заданий");
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://leocoin.onrender.com/api/admin/add-task", {
        title,
        description,
        reward,
        link,
      });

      if (response.data.success) {
        setTasks([response.data.task, ...tasks]); // Yangi vazifa tepaga qo'shiladi
        setTitle("");
        setDescription("");
        setReward(0);
        setLink("");
      }
    } catch (error) {
      setError("Ошибка при добавлении задания");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Админ Панель</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddTask} className="mb-6">
        <input
          type="text"
          placeholder="Название задания"
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
          placeholder="Награда (танга)"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ссылка на Telegram"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Добавить задание
        </button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-4">Задания</h2>
        {tasks.map((task, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Награда: {task.reward} танга</p>
            <a href={task.link} className="text-blue-500 hover:underline">
              Перейти в Telegram
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;