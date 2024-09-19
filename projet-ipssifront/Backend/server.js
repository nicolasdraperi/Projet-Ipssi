const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());  // Pour gérer les requêtes cross-origin entre le front et le back
app.use(bodyParser.json());

// Exemple de route API
app.get('/api/hello', (req, res) => {
    res.send({ message: 'Hello from the backend!' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
