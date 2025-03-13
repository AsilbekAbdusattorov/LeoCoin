import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Fon rasmi optimallashtirilgan */}
      <main
        className="grow py-3 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/main.png')" }}
      >
        <div className="w-full max-w-5xl mx-auto px-5">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
