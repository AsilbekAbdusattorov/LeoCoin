import React from "react";
import Header from "../components/Header";
import Img1 from '../img/tasks/tasks-telegram.png'

const tasks = Array(8).fill({
  title: "Подписаться на Телеграм канал",
  reward: "1 монета",
});

const Tasks = () => {
  return (
    <>
      <Header />
      <div className="bg-[#353535] relative min-h-screen flex flex-col items-center py-6 mt-[50px] rounded-l-[30px] rounded-r-[30px]">
        <div className="px-[22px]">
          <div className="flex justify-center">
            <h2 className="absolute text-center w-[157px] text-xl font-bold bg-white py-2 rounded-2xl drop-shadow-[4px_7px_0px_#FF6108] -top-5 rotate-[5.3deg]">
              Задания
            </h2>
          </div>
          <div className="space-y-4 mt-4">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-white p-3"
              >
                <div className="flex items-center  space-x-3">
                <img className="w-[43px] h-[43px]" src={Img1} alt="img" />
                  <div>
                    <p className="text-[10px] font-bold">{task.title}</p>
                    <p className="text-[10px] text-white">{task.reward}</p>
                  </div>
                </div>
                <button className="bg-white text-[#0101fd] px-[14px] py-[6px] text-sm font-medium rounded-[7px] shadow hover:bg-blue-600 hover:text-white transition drop-shadow-[2px_3px_0px_#FF6108]">
                  Start
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
