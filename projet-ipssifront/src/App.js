import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserDashboard from './pages/UserDashboard';  // Import du Dashboard
import LoginPage from './pages/LoginPage';  // Import de la page de connexion
import SignupPage from './pages/SignupPage';  // Import de la page d'inscription
import AccountManagement from './pages/AccountManagement';  // Import de la page de gestion du compte

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');  // Supprimer le token
        setIsAuthenticated(false);  // Mettre à jour l'état d'authentification
        window.location.href = '/login';  // Rediriger vers la page de connexion
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);  // Met à jour l'état en fonction du token
    }, []);

    return (
        <Router>
            <div className="app">
                <Header onLogout={handleLogout} /> {/* On passe la fonction de déconnexion au Header */}
                <Routes>
                    {/* Route pour la page de connexion */}
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />

                    {/* Route pour la page d'inscription */}
                    <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />

                    {/* Route pour le Dashboard, accessible seulement si l'utilisateur est authentifié */}
                    <Route path="/dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />

                    {/* Route pour la gestion du compte, accessible seulement si l'utilisateur est authentifié */}
                    <Route path="/account" element={isAuthenticated ? <AccountManagement /> : <Navigate to="/login" />} />

                    {/* Redirection de la route "/" vers le Dashboard si l'utilisateur est authentifié, sinon vers /login */}
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
