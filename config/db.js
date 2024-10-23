const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/Escuela';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoBD');
    })
    .catch((error) => {
        console.error('Error conectando a MongoBD:', error);
    });