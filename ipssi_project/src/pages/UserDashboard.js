import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Récupérer les fichiers via une API
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/files');
                setFiles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers:', error);
            }
        };
        fetchFiles();
    }, []);

    return (
        <div className="user-dashboard">
            <h2>Tableau de bord utilisateur</h2>
            <p>Bienvenue sur votre espace de gestion des fichiers.</p>
            <div className="file-list">
                <h3>Vos fichiers</h3>
                <ul>
                    {files.map(file => (
                        <li key={file.id}>{file.name} - {file.size} Mo</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
