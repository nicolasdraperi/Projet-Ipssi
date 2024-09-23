import React from 'react';
import '../assets/css/Footer.css';  // Crée un fichier CSS pour styliser le footer

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; 2024 Mon Application. Tous droits réservés.</p>
            <div className="footer-links">
                <a href="/mentions-legales">Mentions légales</a>
                <a href="/contact">Contact</a>
                <a href="/aide">Aide</a>
            </div>
        </footer>
    );
};

export default Footer;
