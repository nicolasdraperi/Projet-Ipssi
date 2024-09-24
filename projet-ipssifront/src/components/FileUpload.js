import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Debugging: afficher les informations sur le fichier sélectionné
        console.log("Fichier sélectionné :");
        console.log("Nom :", selectedFile.name);
        console.log("Type :", selectedFile.type);
        console.log("Taille :", (selectedFile.size / 1024 / 1024).toFixed(2), "Mo");
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Veuillez sélectionner un fichier.');
            console.log("Aucun fichier sélectionné.");
            return;
        }

        // Validation du type de fichier (seuls JPEG, PNG et PDF sont acceptés)
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setMessage('Type de fichier non valide. Seuls les fichiers JPEG, PNG et PDF sont acceptés.');
            console.log("Erreur de type de fichier :", file.type);
            return;
        }

        // Validation de la taille de fichier (limite de 5 Mo)
        const maxSize = 5 * 1024 * 1024; // 5 Mo
        if (file.size > maxSize) {
            setMessage('Le fichier dépasse la taille maximale autorisée de 5 Mo.');
            console.log("Erreur de taille de fichier :", (file.size / 1024 / 1024).toFixed(2), "Mo");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log("Début de l'upload du fichier...");

            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);

                    // Debugging: afficher la progression
                    console.log("Progression de l'upload :", percentCompleted, "%");
                }
            });

            console.log("Fichier uploadé avec succès !");
            setMessage('Fichier uploadé avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier :', error);
            setMessage('Erreur lors de l\'upload.');
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
