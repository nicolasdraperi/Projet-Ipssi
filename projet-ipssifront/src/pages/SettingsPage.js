import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import '../assets/css/SettingsPage.css';

const SettingsPage = () => {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('fr');

    useEffect(() => {
        // Récupération des paramètres depuis localforage
        localforage.getItem('theme').then((storedTheme) => {
            if (storedTheme) setTheme(storedTheme);
        });
        localforage.getItem('language').then((storedLanguage) => {
            if (storedLanguage) setLanguage(storedLanguage);
        });
    }, []);

    useEffect(() => {
        // Sauvegarde des paramètres dans localforage
        localforage.setItem('theme', theme);
        localforage.setItem('language', language);
    }, [theme, language]);

    const resetSettings = () => {
        localforage.clear();
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
