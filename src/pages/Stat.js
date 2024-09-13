import React from 'react';

const AdminPage = () => {
    return (
        <div className="admin-page">
            <h2>Tableau de bord Administrateur</h2>
            <p>Gestion des utilisateurs et des fichiers</p>

            {/* Affichage des statistiques */}
            <div className="stats">
                <h3>Statistiques</h3>
                <ul>
                    <li>Total des fichiers : 120</li>
                    <li>Fichiers uploadés aujourd'hui : 5</li>
                    <li>Utilisateurs actifs : 20</li>
                </ul>
            </div>

            {/* Liste des utilisateurs */}
            <div className="user-list">
                <h3>Liste des utilisateurs</h3>
                <ul>
                    {/* Ce sera généré dynamiquement via des données d'API */}
                    <li>Utilisateur1 - 10 Go utilisés</li>
                    <li>Utilisateur2 - 5 Go utilisés</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;
