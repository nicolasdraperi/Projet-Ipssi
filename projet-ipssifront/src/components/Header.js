import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

const Header = () => {
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
                    <li><Link to="/logout">Déconnexion</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
