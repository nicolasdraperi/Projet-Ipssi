class File {
    constructor(id, name, size, userId) {
      this.id = id;
      this.name = name;
      this.size = size;
      this.userId = userId;
    }
  }
  
  module.exports = {
    File,
    files: []  // Simuler une base de données
  };
  