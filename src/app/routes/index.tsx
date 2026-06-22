import { createBrowserRouter } from 'react-router-dom';
import { lazy } from "react";
import LazyWrapper from "./LazyWrapper";
import MainLayout from '../../shared/templates/MainLayout';

const DashboardPage = lazy(() => import("../../pages/DashboardPage.tsx"));
const EnergyPage = lazy(() => import("../../pages/EnergyPage"));
const FirePage = lazy(() => import("../../pages/FirePage"));
const PolicePage = lazy(() => import("../../pages/PolicePage"));
const AboutPage = lazy(() => import("../../pages/AboutPage"));
const WeatherPage = lazy(() => import("../../pages/WeatherPage"));
const AdminPage = lazy(() => import("../../features/admin/AdminRoute"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <DashboardPage />
          </LazyWrapper>
        ),
      },
      {
        path: "energy",
        element: (
          <LazyWrapper>
            <EnergyPage />
          </LazyWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <LazyWrapper>
            <AboutPage />
          </LazyWrapper>
        ),
      },
      {
        path: "fire",
        element: (
          <LazyWrapper>
            <FirePage />
          </LazyWrapper>
        ),
      },
      {
        path: "police",
        element: (
          <LazyWrapper>
            <PolicePage />
          </LazyWrapper>
        ),
      },
      {
        path: "weather",
        element: (
          <LazyWrapper>
            <WeatherPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: "admin",
      element: (
        <LazyWrapper>
          <AdminPage />
        </LazyWrapper>
      ),
  }
]);