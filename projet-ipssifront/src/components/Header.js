import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';  // Crée un fichier CSS pour styliser le header

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <h1>Mon Application</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/dashboard">Tableau de bord</Link></li>
                    <li><Link to="/files">Mes fichiers</Link></li>
                    <li><Link to="/upload">Uploader</Link></li>
                    <li><Link to="/subscription">Acheter espace</Link></li>
                    <li><Link to="/invoices">Mes factures</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
