import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ChangePassword from 'views/Login/ChangePassword';


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
      element:<ChangePassword/>
    }
  ]
};

export default AuthenticationRoutes;
