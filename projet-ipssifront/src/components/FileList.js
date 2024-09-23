import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');  // Gérer les erreurs

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/files', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Envoyer le token JWT
                    }
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers', error);
                setError('Erreur lors du chargement des fichiers.');
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h3>Mes fichiers</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.name} - {(file.size / 1024 / 1024).toFixed(2)} Mo {/* Conversion en Mo */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
