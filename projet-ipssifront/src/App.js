import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';  // Importer le Header
import Footer from './components/Footer';  // Importer le Footer

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Pages sans Header et Footer (connexion et inscription) */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Pages avec Header et Footer */}
                    <Route path="/dashboard" element={<><Header /><UserDashboard /><Footer /></>} />
                    <Route path="/admin" element={<><Header /><AdminPage /><Footer /></>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
