import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';

import RoutesComponent from '../routes';

const Application = () => (
  <StrictMode>
    <HashRouter>
      <RoutesComponent />
    </HashRouter>
  </StrictMode>
)

export default Application;