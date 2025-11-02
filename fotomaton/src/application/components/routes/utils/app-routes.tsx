import { Navigate } from "react-router-dom";

import HomePage from "../../../../pages/home";
import CameraPage from "../../../../pages/camera";
import PhotosListPage from "../../../../pages/photos-list";

import { ROUTE_PATHS } from "./route-paths";

import type { RouteTypes } from "./types";

export const appRoutes: RouteTypes[] = [
  {
    key: "not-found",
    path: ROUTE_PATHS.NOT_FOUND,
    element: <div>NOT FOUND PAGE</div>,
  },
  {
    key: "error",
    path: ROUTE_PATHS.ERROR,
    element: <div>ERROR PAGE</div>,
  },
  {
    key: "default",
    path: ROUTE_PATHS.DEFAULT,
    element: <Navigate to={ROUTE_PATHS.HOME} replace />,
  },
  {
    key: "home",
    path: ROUTE_PATHS.HOME,
    element: <HomePage />,
  },
  {
    key: "camera",
    path: ROUTE_PATHS.CAMERA,
    element: <CameraPage />
  },
  {
    key: "photos-list",
    path: ROUTE_PATHS.PHOTOS_LIST,
    element: <PhotosListPage />
  }
]