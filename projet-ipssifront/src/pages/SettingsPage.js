import React, { useState, useEffect } from 'react';
import '../assets/css/SettingsPage.css';

const SettingsPage = () => {
    // État pour stocker les paramètres de l'utilisateur
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('fr');

    // Charger les paramètres depuis le LocalStorage à l'initialisation du composant
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const storedLanguage = localStorage.getItem('language');
        
        if (storedTheme) setTheme(storedTheme);
        if (storedLanguage) setLanguage(storedLanguage);
    }, []);

    // Sauvegarder les paramètres dans le LocalStorage lorsque les préférences changent
    useEffect(() => {
        localStorage.setItem('theme', theme);
        localStorage.setItem('language', language);
    }, [theme, language]);

    // Fonction pour réinitialiser les paramètres
    const resetSettings = () => {
        localStorage.clear(); // Efface toutes les données dans le LocalStorage
        setTheme('light'); // Réinitialise le thème à la valeur par défaut
        setLanguage('fr'); // Réinitialise la langue à la valeur par défaut
    };

    return (
        <div className={`settings-page ${theme}`}>
            <h2>Paramètres</h2>
            
            {/* Sélection du thème */}
            <div className="settings-section">
                <label htmlFor="theme">Thème :</label>
                <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                </select>
            </div>
            
            {/* Sélection de la langue */}
            <div className="settings-section">
                <label htmlFor="language">Langue :</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                </select>
            </div>

            {/* Appliquer les changements dynamiquement */}
            <p>Thème actuel : <strong>{theme}</strong></p>
            <p>Langue actuelle : <strong>{language}</strong></p>

            {/* Bouton de réinitialisation des paramètres */}
            <button onClick={resetSettings}>
                Réinitialiser les paramètres
            </button>
        </div>
    );
};

export default SettingsPage;
