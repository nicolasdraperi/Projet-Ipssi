import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');  // État pour gérer les erreurs

    useEffect(() => {
        // Récupérer les statistiques et la liste des utilisateurs
        const fetchData = async () => {
            try {
                // Récupérer le token JWT stocké dans le localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError("Vous n'êtes pas authentifié.");
                    return;
                }

                // Ajouter le token JWT dans les en-têtes des requêtes
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`  // Inclure le token dans les requêtes
                    }
                };

                const statsResponse = await axios.get('/api/admin/stats', config);
                setStats(statsResponse.data);

                const usersResponse = await axios.get('/api/admin/users', config);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError('Erreur lors de la récupération des données. Veuillez réessayer.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-page">
            <h2>Tableau de bord Administrateur</h2>
            <p>Gestion des utilisateurs et des fichiers</p>

            {/* Affichage des erreurs */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="stats">
                <h3>Statistiques</h3>
                <ul>
                    <li>Total des fichiers : {stats.totalFiles}</li>
                    <li>Fichiers uploadés aujourd'hui : {stats.filesToday}</li>
                    <li>Utilisateurs actifs : {stats.activeUsers}</li>
                </ul>
            </div>

            <div className="user-list">
                <h3>Liste des utilisateurs</h3>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} - {user.storageUsed} Go utilisés</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPage;
