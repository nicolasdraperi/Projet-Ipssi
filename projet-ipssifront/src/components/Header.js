import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

const Header = ({ onLogout }) => {
    return (
        <header className="header">
            <div className="header-logo">
                <h1>Mon Application</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/settings">Paramètres</Link></li>
                    <li><Link to="/account">Gestion de compte</Link></li>
                    {/* Remplace le lien de déconnexion par un bouton qui déclenche la fonction onLogout */}
                    <li><button onClick={onLogout}>Déconnexion</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
