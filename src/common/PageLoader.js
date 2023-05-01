import React from 'react';
import './PageLoader.css';

const PageLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader" data-testid="page-loader"></div>
    </div>
  );
}

export default PageLoader;