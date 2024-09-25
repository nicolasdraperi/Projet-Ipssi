const { Invoice, invoices } = require('../models/Invoice');

// Générer une facture
exports.generateInvoice = (req, res) => {
  const { userId, amount, description } = req.body;
  const newInvoice = new Invoice(invoices.length + 1, userId, new Date(), amount, description);
  invoices.push(newInvoice);

  res.status(200).json({ message: 'Facture générée avec succès', invoice: newInvoice });
};
