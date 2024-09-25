import React, { useState, useEffect } from 'react';
import '../assets/css/SettingsPage.css';

const SettingsPage = () => {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('fr');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const storedLanguage = localStorage.getItem('language');
        
        if (storedTheme) setTheme(storedTheme);
        if (storedLanguage) setLanguage(storedLanguage);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        localStorage.setItem('language', language);
    }, [theme, language]);

    const resetSettings = () => {
        localStorage.clear();
        setTheme('light');
        setLanguage('fr');
    };

    return (
        <div className={`settings-page ${theme}`}>
            <h2>Paramètres</h2>
            
            <div className="settings-section">
                <h3>Thème</h3>
                <p>Choisissez votre thème :</p>
                <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                </select>
            </div>
            
            <div className="settings-section">
                <h3>Langue</h3>
                <p>Choisissez votre langue :</p>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                </select>
            </div>

            <div className="current-settings">
                <p><strong>Thème actuel :</strong> {theme}</p>
                <p><strong>Langue actuelle :</strong> {language}</p>
            </div>

            <button className="reset-btn" onClick={resetSettings}>
                Réinitialiser les paramètres
            </button>
        </div>
    );
};

export default SettingsPage;
