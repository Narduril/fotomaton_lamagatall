import React from "react";
import { Route, Routes } from "react-router-dom";

import { appRoutes } from "./utils/app-routes";
import type { RouteTypes } from "./utils/types";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      {appRoutes.map((route: RouteTypes) => (
        <Route key={route.key} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default RoutesComponent;