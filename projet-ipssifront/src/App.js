import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserDashboard from './pages/UserDashboard';  // Import du Dashboard
import LoginPage from './pages/LoginPage';  // Import de la page de connexion
import SignupPage from './pages/SignupPage';  // Import de la page d'inscription

const App = () => {
    // Vérifier si l'utilisateur est authentifié (par exemple en vérifiant le token dans le localStorage)
    const isAuthenticated = !!localStorage.getItem('token');  // Le token est stocké après la connexion

    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    {/* Route pour la page de connexion */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Route pour la page d'inscription */}
                    <Route path="/signup" element={<SignupPage />} />  {/* Ajout de la route pour s'inscrire */}

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
