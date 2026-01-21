import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <App />

      {/* 🔔 Global Success / Error Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: '500',
          },
        }}
      />
    </BrowserRouter>
  
);
