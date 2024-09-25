class Invoice {
    constructor(id, userId, date, amount, description) {
      this.id = id;
      this.userId = userId;
      this.date = date;
      this.amount = amount;
      this.description = description;
    }
  }
  
  module.exports = {
    Invoice,
    invoices: []  // Simuler une base de données
  };
  