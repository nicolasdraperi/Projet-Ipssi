import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserDashboard from './pages/UserDashboard';  // Import du Dashboard pour les utilisateurs
import LoginPage from './pages/LoginPage';  // Import de la page de connexion
import SignupPage from './pages/SignupPage';  // Import de la page d'inscription
import AccountManagement from './pages/AccountManagement';  // Import de la page de gestion du compte
import MentionsLegales from './pages/MentionsLegales';  // Import des mentions légales
import SettingsPage from './pages/SettingsPage';  // Import de la page des paramètres
import AdminPage from './pages/AdminPage';  // Import de la page administrateur

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('token');  // Supprimer le token
        localStorage.removeItem('role');   // Supprimer le rôle
        setIsAuthenticated(false);  // Mettre à jour l'état d'authentification
        setUserRole(null);  // Supprimer le rôle
        window.location.href = '/login';  // Rediriger vers la page de connexion
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setIsAuthenticated(!!token);  // Mettre à jour l'état en fonction de la présence d'un token
        setUserRole(role);  // Mettre à jour le rôle de l'utilisateur
    }, []);

    return (
        <Router>
            <div className="app">
                <Header onLogout={handleLogout} /> {/* On passe la fonction de déconnexion au Header */}
                <Routes>
                    {/* Route pour la page de connexion */}
                    <Route 
                        path="/login" 
                        element={isAuthenticated ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
                    />

                    {/* Route pour la page d'inscription */}
                    <Route 
                        path="/signup" 
                        element={isAuthenticated ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} /> : <SignupPage />}
                    />

                    {/* Route pour le Dashboard utilisateur standard */}
                    <Route 
                        path="/dashboard" 
                        element={isAuthenticated && userRole !== 'admin' ? <UserDashboard /> : <Navigate to="/login" />}
                    />

                    {/* Route pour la page d'administration */}
                    <Route 
                        path="/admin" 
                        element={isAuthenticated && userRole === 'admin' ? <AdminPage /> : <Navigate to="/login" />}
                    />

                    {/* Route pour la gestion du compte */}
                    <Route 
                        path="/account" 
                        element={isAuthenticated ? <AccountManagement /> : <Navigate to="/login" />}
                    />

                    {/* Route pour les mentions légales */}
                    <Route 
                        path="/mentions-legales" 
                        element={<MentionsLegales />} 
                    />

                    {/* Route pour les paramètres */}
                    <Route 
                        path="/settings" 
                        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
                    />

                    {/* Redirection par défaut selon le rôle de l'utilisateur */}
                    <Route 
                        path="/" 
                        element={isAuthenticated ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} /> : <Navigate to="/login" />}
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
