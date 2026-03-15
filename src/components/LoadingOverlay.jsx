import React from 'react';
import { useSelector } from 'react-redux';

export default function LoadingOverlay() {
  const isLoading = useSelector((s) => s.ui.isLoading);
  if (!isLoading) return null;

  return (
    <div className="loadingOverlay">
      <div className="spinner" />
      <div className="loadingText">Memuat...</div>
    </div>
  );
}