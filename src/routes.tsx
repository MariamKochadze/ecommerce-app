/* eslint-disable no-unused-vars */
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Main } from './components/main/Main';
import { Login } from './components/login/Login';
import { Registration } from './components/registration/Registration';
import { App } from './components/app/App';
import { RoutingError404 } from './components/routingError/RoutingError404';
import CatalogPage from './components/catalog/CatalogPage';

export enum ERoutesPaths {
  Login = 'login',
  Registration = 'registration',
  Error404 = '404',
  Catalog = 'catalog',
}

const router = createBrowserRouter([
  {
    element: <App />,
    path: '/',
    children: [
      {
        element: <Main />,
        path: '/',
      },
      {
        element: <Login />,
        path: ERoutesPaths.Login,
      },
      {
        element: <Registration />,
        path: ERoutesPaths.Registration,
      },
      {
        element: <CatalogPage />,
        path: ERoutesPaths.Catalog,
      },
      {
        element: <RoutingError404 />,
        path: ERoutesPaths.Error404,
      },
      {
        element: <Navigate to={ERoutesPaths.Error404} />,
        path: '*',
      },
    ],
  },
]);

export default router;
