import React, { useState, useEffect } from "react";
import Img1 from "../img/loading/loading2.png"; // O'zgartiring: loading2.png faylining manzili
import Img2 from "../img/loading/loading3.png"; // O'zgartiring: loading3.png faylining manzili

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-600 text-white">
      {/* Yuqori qismdagi rasm */}
      <img src={Img2} alt="Yuqori rasm" className="mb-4" />

      {/* Sarlavha */}
      <h2 className="text-2xl text-center font-bold mb-8">Забирай<br /> гарантированный приз!</h2>

      {/* Pastki qismdagi rasm */}
      <div className="mb-12">
        <img src={Img1} alt="Pastki rasm" />
      </div>

      {/* Loading yozuvi */}
      <p className="mb-4 text-lg">Loading...</p>

      {/* Progress bar */}
      <div className="w-64 h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;