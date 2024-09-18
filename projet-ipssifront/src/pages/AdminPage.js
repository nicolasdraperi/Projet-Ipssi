import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Récupérer les statistiques et la liste des utilisateurs
        const fetchData = async () => {
            try {
                const statsResponse = await axios.get('/api/admin/stats');
                setStats(statsResponse.data);
                const usersResponse = await axios.get('/api/admin/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="admin-page">
            <h2>Tableau de bord Administrateur</h2>
            <p>Gestion des utilisateurs et des fichiers</p>

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
