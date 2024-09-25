import React from 'react';
import '../assets/css/Invoices.css';  // Importation du fichier CSS pour styliser le composant

const Invoices = () => {
    const invoices = [
        {
            id: 1,
            date: '2024-09-20',
            totalHT: 20,
            totalTTC: 24,
            TVA: 4,
            client: {
                nom: 'Dupont',
                adresse: '123 Rue de la Paix, Paris'
            },
            societe: {
                nom: 'Mon Entreprise',
                adresse: '456 Avenue des Champs-Élysées, Paris',
                siret: '123 456 789 00010'
            }
        }
    ];

    return (
        <div className="invoices-container">
            <h2>Mes factures</h2>
            {invoices.map(invoice => (
                <div key={invoice.id} className="invoice-card">
                    <div className="invoice-header">
                        <h3>Facture #{invoice.id}</h3>
                        <p>Date : {invoice.date}</p>
                    </div>
                    <div className="invoice-details">
                        <p><strong>Client :</strong> {invoice.client.nom}</p>
                        <p><strong>Adresse :</strong> {invoice.client.adresse}</p>
                        <p><strong>Total HT :</strong> {invoice.totalHT} €</p>
                        <p><strong>Total TTC :</strong> {invoice.totalTTC} €</p>
                        <p><strong>TVA :</strong> {invoice.TVA} €</p>
                    </div>
                    <div className="invoice-footer">
                        <button className="download-btn">
                            <i className="fa fa-download"></i> Télécharger la facture
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Invoices;
