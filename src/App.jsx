import React, { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

// pages
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Balance from './pages/Balance';
import PageNotFound from './pages/PageNotFound';
import MainLayout from './layouts/MainLayout';
import Invite from './pages/Invite';
import Loader from './components/Loader'; // Loader komponentini import qilamiz

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3 soniya ichida yuklanishni tugatish
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/Balance" element={<Balance />} />
        <Route path="/Invite" element={<Invite />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <>{loading ? <Loader /> : <RouterProvider router={router} />}</>;
};

export default App;
