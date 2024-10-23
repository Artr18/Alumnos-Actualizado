const mongoose = require('mongoose');

// Crear un esquema de su documento (tabla)
const alumnoSchema = new mongoose.Schema({
    NC: { type: Number, required: true, unique: true }, // Índice único para NC
    Nombre: { type: String, required: true },
    App: { type: String, required: true },
    Apm: { type: String, required: true },
    IDGrupo: { type: String, required: true }
});


// Se exporta el modelo según el esquema llamado Alumno
module.exports = mongoose.model('Alumno', alumnoSchema);