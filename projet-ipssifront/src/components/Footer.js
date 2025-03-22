import React from 'react';
import { Link } from 'react-router-dom';  // Utilisez Link pour la navigation interne
import '../assets/css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; 2024 Mon Application. Tous droits réservés.</p>
            <div className="footer-links">
                {/* Ajoutez le lien vers la page des Mentions légales */}
                <Link to="/mentions-legales">Mentions légales</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/aide">Aide</Link>
            </div>
        </footer>
    );
};

export default Footer;
