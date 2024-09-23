import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Veuillez sélectionner un fichier.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Appel à l'API pour uploader le fichier
            const response = await axios.post('http://localhost:5000/files', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // Afficher la réponse de l'API
            console.log(response.data);  // Afficher les données retournées par l'API

            setMessage('Fichier uploadé avec succès !');
        } catch (error) {
            setMessage('Erreur lors de l\'upload.');
            console.error('Erreur lors de l\'upload du fichier', error);
        }
    };

    return (
        <div>
            <h3>Uploader un fichier</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Uploader</button>
            {uploadProgress > 0 && <p>Progression : {uploadProgress}%</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
