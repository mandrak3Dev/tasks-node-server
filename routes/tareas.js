// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//api/tareas
//Crea una tarea
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty(),
    ],
    tareaController.crearTarea
);
// Obtener tareas por proyectos
router.get('/', 
    auth,
    tareaController.obtenerTareas
);
// Actualizar tareas por id
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
    ],
    tareaController.actualizarTareas
);

// Eliminar tareas por id
router.delete('/:id', 
    auth,
    tareaController.eliminarTareas
);

module.exports = router;