import React from 'react';
import { useNavigate } from 'react-router-dom';

import '@commons/components/presentational/back-button/back-button.css';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="back-button" onClick={() => navigate(-1)}>
      <p className="back-button__cross">X</p>
    </div>
  );
};

export default BackButton;