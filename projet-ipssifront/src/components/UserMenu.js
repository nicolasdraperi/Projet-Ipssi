import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/UserMenu.css';  // Crée un fichier CSS pour styliser le menu

const UserMenu = () => {
    return (
        <div className="user-menu">
            <h2>Mon Compte</h2>
            <ul>
                <li><Link to="/dashboard">Tableau de bord</Link></li>
                <li><Link to="/files">Mes fichiers</Link></li>
                <li><Link to="/upload">Uploader un fichier</Link></li>
                <li><Link to="/subscription">Acheter de l'espace de stockage</Link></li>
                <li><Link to="/invoices">Mes factures</Link></li>
                <li><Link to="/delete-account">Supprimer mon compte</Link></li>
            </ul>
        </div>
    );
};

export default UserMenu;
