import React, { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Sahifalar
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Balance from "./pages/Balance";
import PageNotFound from "./pages/PageNotFound";
import MainLayout from "./layouts/MainLayout";
import Invite from "./pages/Invite";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsAdminDashboard from "./pages/ProductsAdminDashboard"; // Yangi qo'shilgan mahsulotlar paneli
import AdminPanelSelector from "./pages/AdminPanelSelector"; // Yangi qo'shilgan admin panel tanlovi
import Loader from "./components/Loader";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(
    localStorage.getItem("registered") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).isAdmin
  );

  useEffect(() => {
    // 3 soniya yuklanish effekti
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Agar foydalanuvchi ro'yxatdan o'tmagan bo'lsa, register sahifasiga yo'naltiriladi */}
        <Route
          path="/"
          element={isRegistered ? <Navigate to="/home" /> : <Navigate to="/register" />}
        />
        <Route path="/register" element={<Register setIsRegistered={setIsRegistered} />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/invite" element={<Invite />} />
          {/* Agar foydalanuvchi admin bo'lsa, AdminPanelSelector sahifasiga yo'naltiriladi */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminPanelSelector /> : <Navigate to="/home" />}
          />
          <Route path="/admin/tasks" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductsAdminDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </>
    )
  );

  return <>{loading ? <Loader /> : <RouterProvider router={router} />}</>;
};

export default App;