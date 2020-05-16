// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//api/proyectos
//Crea un proyecto
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
    ],
    proyectoController.crearProyecto
);
// Obtener todos los proyectos
router.get('/', 
    auth,
    proyectoController.obtenerProyectos
);
// Actualizar proyectos por id
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
    ],
    proyectoController.actualizarProyectos
);

// Eliminar proyectos por id
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyectos
);

module.exports = router;