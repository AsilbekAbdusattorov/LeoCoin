import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Img1 from "../img/tasks/tasks-telegram.png";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({}); // Vazifa holati (bajarilgan yoki yo'q)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://leocoin.onrender.com/api/admin/tasks"
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Vazifalarni yuklashda xatolik:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = async (taskId, link) => {
    try {
      const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

      if (!userEmail) {
        alert("Foydalanuvchi emaili topilmadi. Iltimos, avval tizimga kiring.");
        return;
      }

      if (!taskId) {
        alert("Vazifa IDsi topilmadi.");
        return;
      }

      const userResponse = await axios.get(
        "https://leocoin.onrender.com/api/auth/user",
        {
          params: { email: userEmail },
        }
      );

      if (!userResponse.data.success) {
        alert("Foydalanuvchi topilmadi!");
        return;
      }

      if (userResponse.data.user.completedTasks.includes(taskId)) {
        alert("Bu vazifa allaqachon bajarilgan.");
        setTaskStatus((prev) => ({ ...prev, [taskId]: true }));
        return;
      }

      const userId = userResponse.data.user.telegramId;

      // Obuna holatini tekshirish
      const subscriptionCheck = await axios.post(
        "https://leocoin.onrender.com/api/auth/check-subscription",
        {
          userId,
        }
      );

      if (!subscriptionCheck.data.isSubscribed) {
        alert("Iltimos, kanalga obuna boʻling!");
        return;
      }

      const response = await axios.post(
        "https://leocoin.onrender.com/api/auth/complete-task",
        {
          email: userEmail,
          taskId,
        }
      );

      if (response.data.success) {
        setTaskStatus((prev) => ({ ...prev, [taskId]: true }));

        const updatedUser = await axios.get(
          "https://leocoin.onrender.com/api/auth/user",
          {
            params: { email: userEmail },
          }
        );

        if (updatedUser.data.success) {
          const { level } = updatedUser.data.user;
          alert(`Tabriklaymiz! Sizning darajangiz: ${level}`);
        }

        window.open(link, "_blank");
      }
    } catch (error) {
      console.error(
        "Vazifani bajarishda xatolik:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Vazifani bajarishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#353535] relative min-h-screen flex flex-col items-center py-6 mt-[50px] rounded-l-[30px] rounded-r-[30px]">
        <div className="px-[22px] w-full max-w-4xl">
          <div className="flex justify-center">
            <h2 className="absolute text-center w-[157px] text-xl font-bold bg-white py-2 rounded-2xl drop-shadow-[4px_7px_0px_#FF6108] -top-5 rotate-[5.3deg]">
              Задания
            </h2>
          </div>
          <div className="space-y-4 mt-12">
            {/* Vazifalarni render qilish */}
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#444] text-white p-4 rounded-lg shadow-lg hover:bg-[#555] transition duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="w-[50px] h-[50px] rounded-lg"
                    src={Img1}
                    alt="img"
                  />
                  <div>
                    <p className="text-sm font-bold">{task.title}</p>
                    <p className="text-xs text-gray-300">{task.reward} tanga</p>
                  </div>
                </div>
                <button
                  className={`bg-white text-[#0101fd] px-4 py-2 text-sm font-medium rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-300 ${
                    taskStatus[task._id] ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleTaskClick(task._id, task.link)}
                  disabled={taskStatus[task._id]}
                >
                  {taskStatus[task._id] ? "Выполнено" : "Start"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;