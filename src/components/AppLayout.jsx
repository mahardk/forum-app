import React from 'react';
import NavBar from './NavBar';
import LoadingOverlay from './LoadingOverlay';

export default function AppLayout({ children }) {
  return (
    <>
      <NavBar />
      <main className="container">
        {children}
      </main>
      <LoadingOverlay />
    </>
  );
}