// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext'; // ✅ ADD THIS IMPORT
import './index.css';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <BrowserRouter>
      <AuthProvider>  {/* ✅ ADD THIS WRAPPER */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}