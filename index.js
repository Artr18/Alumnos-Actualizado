const express = require('express');
const methodOverride = require('method-override');
const app = express();
// Middleware para permitir PUT y DELETE en formularios HTML
app.use(methodOverride('_method'));
require('./config/db'); // Conectar a la base de datos
// Configuración de EJS
app.set('view engine', 'ejs');
// Middleware para manejar JSON y datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Asegúrate de incluir esto para manejar JSON
// Importar y usar el controlador de alumnos
const alumnoControllers = require('./controllers/alumnoControllers');
app.use('/', alumnoControllers);
// Servir archivos estáticos
app.use(express.static(__dirname + '/public/'));
// Iniciar el servidor
app.listen(3000, function() {
    console.log('Servidor ejecutándose en el puerto 3000');
});