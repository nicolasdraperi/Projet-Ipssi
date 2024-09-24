import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserDashboard from './pages/UserDashboard';  // Import du Dashboard
import LoginPage from './pages/LoginPage';  // Import de la page de connexion
import SignupPage from './pages/SignupPage';  // Import de la page d'inscription

const App = () => {
    // État pour vérifier si l'utilisateur est authentifié
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        console.log("Déconnexion : Suppression du token et mise à jour de l'état.");
        localStorage.removeItem('token');  // Supprimer le token
        setIsAuthenticated(false);  // Mettre à jour l'état d'authentification
    };

    // Mettre à jour l'état isAuthenticated quand le token change dans le localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Vérification du token au lancement :", token);
        setIsAuthenticated(!!token);  // Met à jour l'authentification si le token est présent
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
                    <Route 
                        path="/dashboard" 
                        element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} 
                    />

                    {/* Rediriger la route "/" vers /dashboard si l'utilisateur est authentifié, sinon vers /login */}
                    <Route 
                        path="/" 
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
