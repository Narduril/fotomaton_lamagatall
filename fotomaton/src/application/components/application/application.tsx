import { StrictMode } from 'react';
import RoutesComponent from '../routes';
import { BrowserRouter } from 'react-router-dom';

const Application = () => (
  <StrictMode>
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  </StrictMode>
)

export default Application;