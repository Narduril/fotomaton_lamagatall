import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { appRoutes } from '@app/components/routes/utils/app-routes';
import type { RouteTypes } from '@app/components/routes/utils/types';

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