import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Simule une requête pour récupérer les fichiers (API locale ou distante)
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/files');  // Modifier l'URL si nécessaire
                setFiles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers', error);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h3>Mes fichiers</h3>
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.name} - {file.size} Mo
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
