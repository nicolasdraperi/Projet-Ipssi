import React from 'react';

const UserDashboard = () => {
    return (
        <div className="user-dashboard">
            <h2>Tableau de bord utilisateur</h2>
            {/* Ajouter des fonctionnalités pour afficher les fichiers et gérer le stockage */}
            <p>Bienvenue sur votre espace de gestion des fichiers.</p>
            {/* Exemple d'affichage des fichiers à lister */}
            <div className="file-list">
                <h3>Vos fichiers</h3>
                <ul>
                    {/* Ce sera généré dynamiquement via des données d'API */}
                    <li>fichier1.pdf - 2 Mo</li>
                    <li>fichier2.png - 1.5 Mo</li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
