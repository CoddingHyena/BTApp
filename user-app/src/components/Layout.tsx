import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;