import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import OwnerPage from './OwnerPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/owner" element={<ProtectedRoute element={<OwnerPage />} roles={['owner']} />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
}

export default App;
