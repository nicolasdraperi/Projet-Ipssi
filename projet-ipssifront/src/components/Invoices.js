import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/Invoices.css'; // Assurez-vous que le fichier CSS est bien importé

const API_URL = 'http://localhost:3000'; // Point d'entrée de votre backend

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Charger les factures de l'utilisateur
        const fetchInvoices = async () => {
            try {
                const userId = localStorage.getItem('userId'); // Supposons que l'ID utilisateur est stocké dans le localStorage
                const response = await axios.get(`${API_URL}/api/invoices/user/${userId}`);
                setInvoices(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des factures :', error);
                setMessage('Impossible de récupérer les factures pour le moment.');
            }
        };

        fetchInvoices();
    }, []);

    // Fonction pour télécharger la facture
    const handleDownloadInvoice = async (invoiceId) => {
        try {
            const response = await axios.get(`${API_URL}/telecharger-pdf/${invoiceId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture_${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            setMessage('Téléchargement de la facture réussi.');
        } catch (error) {
            console.error('Erreur lors du téléchargement de la facture :', error);
            setMessage('Erreur lors du téléchargement de la facture.');
        }
    };

    // Fonction pour envoyer la facture par e-mail
    const handleSendInvoiceEmail = async (invoiceId) => {
        try {
            const email = prompt('Entrez l’adresse e-mail pour recevoir la facture :');
            if (!email) {
                return setMessage('Adresse e-mail non fournie.');
            }

            await axios.post(`${API_URL}/send-email`, {
                to: email,
                subject: `Votre facture #${invoiceId}`,
                text: `Veuillez trouver votre facture #${invoiceId} en pièce jointe.`,
            });

            setMessage(`Facture envoyée avec succès à ${email}.`);
        } catch (error) {
            console.error('Erreur lors de l’envoi de la facture :', error);
            setMessage('Erreur lors de l’envoi de la facture.');
        }
    };

    return (
        <div className="invoices-container">
            <h2>Mes Factures</h2>
            {message && <p className="message">{message}</p>}

            {invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <div key={invoice.id} className="invoice-card">
                        <div className="invoice-header">
                            <h3>Facture #{invoice.id}</h3>
                            <p>Date : {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="invoice-details">
                            <p><strong>Client :</strong> Utilisateur ID {invoice.userId}</p>
                            <p><strong>Total :</strong> {invoice.amount} €</p>
                            <p><strong>Description :</strong> {invoice.description}</p>
                        </div>
                        <div className="invoice-actions">
                            <button
                                className="download-btn"
                                onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                                <i className="fa fa-download"></i> Télécharger
                            </button>
                            <button
                                className="send-btn"
                                onClick={() => handleSendInvoiceEmail(invoice.id)}
                            >
                                <i className="fa fa-envelope"></i> Envoyer par e-mail
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucune facture disponible.</p>
            )}
        </div>
    );
};

export default Invoices;
