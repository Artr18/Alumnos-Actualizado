const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <--- Agrega esta línea
const Alumno = require('../models/Alumno');

// Obtiene todos los alumnos
router.get('/alumnos', async(req, res) => {
    try {
        const alumnos = await Alumno.find(); // Obtiene los alumnos de la base de datos
        ///res.json(alumnos);
        res.render('index', { alumnos }); // Renderiza la vista 'index.ejs' con los datos de alumnos
    } catch (error) {
        console.error('Error obteniendo alumnos:', error);
        res.status(500).json({ error: 'Error de servidor' });
    }
});

// Ruta para mostrar el formulario de edición de un alumno
router.get('/alumnos/edit/:id', async(req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id); // Busca al alumno por su ID
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.render('edit', { alumno }); // Renderiza la vista de edición con los datos del alumno
    } catch (error) {
        console.error('Error al obtener alumno para editar:', error);
        res.status(500).json({ error: 'Error de servidor' });
    }
});




// Ruta para insertar un nuevo alumno
router.post('/alumnos', async(req, res) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        const alumnoGuardado = await nuevoAlumno.save();
        res.status(201).json(alumnoGuardado);
    } catch (error) {
        console.error('Error al crear alumno:', error);
        res.status(400).json({ error: 'Error al crear alumno' });
    }
});

// Ruta para actualizar un alumno (por NC o ID)
router.put('/alumnos/:identifier', async(req, res) => {
    try {
        const identifier = req.params.identifier.trim(); // Limpiar el identificador
        let alumnoActualizado;
        // Verifica si el identifier es un ObjectId válido (24 caracteres hexadecimales)
        const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);
        if (isValidObjectId) {
            // Intentar actualizar por ID
            alumnoActualizado = await Alumno.findByIdAndUpdate(identifier, req.body, { new: true });
        }
        // Si no es un ObjectId o no encontró nada, intenta por NC
        if (!alumnoActualizado) {
            alumnoActualizado = await Alumno.findOneAndUpdate({ NC: identifier }, req.body, { new: true });
        }
        // Verificar si el alumno fue encontrado y actualizado
        if (!alumnoActualizado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        // Redirigir a la página de alumnos con un mensaje de éxito
        res.redirect('/alumnos?success=Alumno actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        res.status(500).json({ error: 'Error al actualizar alumno' });
    }
});


// Ruta para eliminar un alumno (por NC o ID)
router.delete('/alumnos/:identifier', async(req, res) => {
    try {
        const identifier = req.params.identifier.trim(); // Limpiar el identificador

        // Verificar si el identificador es un ObjectId válido (24 caracteres hexadecimales)
        let alumnoEliminado;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Intentar eliminar por ID si es un ObjectId válido
            alumnoEliminado = await Alumno.findByIdAndDelete(identifier);
        }

        // Si no se eliminó por ID, intentar eliminar por NC (número de control)
        if (!alumnoEliminado) {
            alumnoEliminado = await Alumno.findOneAndDelete({ NC: identifier });
        }

        // Verificar si el alumno fue encontrado y eliminado
        if (!alumnoEliminado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Devolver un mensaje de éxito
        res.json({ message: 'Alumno eliminado' });
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        res.status(500).json({ error: 'Error de servidor', details: error.message });
    }
});


module.exports = router; // Asegúrate de que esto esté presente