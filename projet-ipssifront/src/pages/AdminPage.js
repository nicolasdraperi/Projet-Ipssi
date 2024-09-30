import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');  // État pour gérer les erreurs
    const [loading, setLoading] = useState(true);  // État pour gérer le chargement des données

    useEffect(() => {
        // Récupérer les statistiques des utilisateurs
        const fetchUserStats = async () => {
            try {
                // Récupérer le token JWT stocké dans le localStorage
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError("Vous n'êtes pas authentifié.");
                    setLoading(false);
                    return;
                }

                // Ajouter le token JWT dans les en-têtes des requêtes
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`  // Inclure le token dans les requêtes
                    }
                };

                // Appel de l'API pour récupérer les statistiques des utilisateurs
                const response = await axios.get('http://localhost:5000/api/admin/user-stats', config);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError('Erreur lors de la récupération des données. Veuillez réessayer.');
                setLoading(false);
            }
        };

        fetchUserStats();
    }, []);

    if (loading) {
        return <div>Chargement des statistiques...</div>;
    }

    return (
        <div className="admin-page">
            <h2>Tableau de bord Administrateur</h2>
            <p>Gestion des utilisateurs et des fichiers</p>

            {/* Affichage des erreurs */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="user-list">
                <h3>Liste des utilisateurs</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Nombre de fichiers</th>
                            <th>Taille totale des fichiers (Mo)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.surname}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.fileCount}</td>
                                <td>{(user.totalSize / (1024 * 1024)).toFixed(2)}</td> {/* Convertir la taille en Mo */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
