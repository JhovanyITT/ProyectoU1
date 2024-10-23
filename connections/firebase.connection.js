const admin = require('firebase-admin'); // Importando firebase-admin
var serviceAccount = require('./firebase-credentials.json'); // Importando el archivo con los datos de la conexión

// Inicializador de servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;

