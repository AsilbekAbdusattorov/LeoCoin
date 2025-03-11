import React, { useState, useEffect } from 'react';
import Img1 from '../img/loading/loading.png'
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
      <div className='mb-36'>
        <img src={Img1} alt="img" />
      </div>
      <p className="mb-2">Loading...</p>
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
