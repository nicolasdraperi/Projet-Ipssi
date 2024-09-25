import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/FileUpload.css'; // Assurez-vous que le chemin est correct

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // État pour stocker l'URL de prévisualisation
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Gérer la prévisualisation des images et des PDF
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result); // Crée une URL de prévisualisation du fichier
            };
            reader.readAsDataURL(selectedFile); // Crée une URL pour l'image ou le PDF
        } else {
            setPreview(null);
        }

        console.log("Fichier sélectionné :", selectedFile.name);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Veuillez sélectionner un fichier.');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setMessage('Type de fichier non valide. Seuls les fichiers JPEG, PNG et PDF sont acceptés.');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5 Mo
        if (file.size > maxSize) {
            setMessage('Le fichier dépasse la taille maximale autorisée de 5 Mo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Token manquant. Veuillez vous reconnecter.');
                return;
            }

            await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setMessage('Fichier uploadé avec succès !');
        } catch (error) {
            setMessage('Erreur lors de l\'upload.');
        }
    };

    return (
        <div className="container-upload-fichier">
            <h3>Uploader un fichier</h3>

            {/* Label pour choisir un fichier */}
            <label htmlFor="file-upload" className="label-file">Choisir un fichier</label>
            <input id="file-upload" type="file" onChange={handleFileChange} />

            {/* Prévisualisation du fichier sélectionné */}
            {preview && (
                <div className="preview-container">
                    {file.type.includes('image') ? (
                        <img src={preview} alt="Prévisualisation" className="preview-image" />
                    ) : (
                        <embed src={preview} type={file.type} width="300" height="400" />
                    )}
                </div>
            )}

            <button onClick={handleUpload}>Uploader</button>

            {uploadProgress > 0 && (
                <div className="progression-upload">
                    <div style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}

            {message && (
                <p className={message.includes('succès') ? 'message-succes' : 'message-erreur'}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
