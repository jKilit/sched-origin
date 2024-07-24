import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
  </CookiesProvider>
);
