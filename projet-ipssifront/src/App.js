import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';

const App = () => {
    return (
        <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} /> {/* Utilisation de element à la place de component */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
};

export default App;
