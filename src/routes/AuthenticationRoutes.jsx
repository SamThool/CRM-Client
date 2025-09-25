import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ChangePassword from 'views/Login/ChangePassword';
import ForgetPassword from 'views/Login/ForgetPassword';
import Landing from 'layout/Landing';

const AuthLogin = Loadable(lazy(() => import('../views/Login')));
// const AuthRegister = Loadable(lazy(() => import('../views/Register')));

// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/change-password',
      element: <ChangePassword />
    },
    {
      path: '/forgot-password',
      element: <ForgetPassword />
    },
    {
      path: '/landing',
      element: <Landing />
    }
  ]
};

export default AuthenticationRoutes;
