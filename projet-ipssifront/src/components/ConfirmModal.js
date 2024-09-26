import React from 'react';
import '../assets/css/ConfirmModal.css';
const ConfirmModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null; // Si show est faux, ne pas afficher la modal

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p>Es-tu sûr de vouloir supprimer ce fichier ?</p>
                <button className="confirm-btn" onClick={onConfirm}>Oui</button>
                <button className="cancel-btn" onClick={onCancel}>Non</button>
            </div>
        </div>
    );
};

export default ConfirmModal;
