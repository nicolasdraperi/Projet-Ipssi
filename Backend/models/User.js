const bcrypt = require('bcryptjs');
const users = [];  // Simuler une base de données

class User {
  constructor(id, email, password, firstName, lastName, address) {
    this.id = id;
    this.email = email;
    this.password = bcrypt.hashSync(password, 10);
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
  }
}

module.exports = {
  User,
  users
};
