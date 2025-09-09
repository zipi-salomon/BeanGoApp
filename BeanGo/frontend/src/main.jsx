import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import Login from './auth/Login.jsx';
import App from './App.jsx';
import Menu from './components/product/menu.jsx';
import Signup from './auth/signup.jsx';
import Header from './components/Header.jsx';
import Cart from './components/cart.jsx';
import Shops from './components/shops.jsx';
import Contact from './components/Contact.jsx';
import About from './components/about/about.jsx';
import Logout from './components/logout.jsx';
import Profile from './components/profile.jsx';
import AdminUser from './components/users/adminUser.jsx';
import OrdersManagement from './components/OrdersManagement.jsx';
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> }, // פה הפנייה לכניסה כברירת מחדל
      { path: '/login', element: <Login /> },
      { path: '/menu', element: <Menu /> },
      { path: '/signup', element: <Signup /> },
      { path: '/header', element: <Header /> },
      { path: '/cart', element: <Cart /> },
      { path: '/shops', element: <Shops /> },
      { path: '/contact', element: <Contact /> },
      { path: '/logout', element: <Logout /> },
      { path: '/about', element: <About /> },
      { path: '/menu/:shopId', element: <Menu /> },
      { path: '/profile', element: <Profile/> },
      { path: '/adminUser', element: <AdminUser /> },
      { path: '/orders', element: <OrdersManagement /> },

    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);