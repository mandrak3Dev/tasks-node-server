const Tarea = require("../models/Tareas");
const Proyecto = require("../models/Proyectos");
const { validationResult } = require("express-validator");

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  //Validar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Extraer proyecto y comprobar si existe
    const {proyecto} = req.body;  
    
    const proyectoActual = await Proyecto.findById(proyecto);  
    if(!proyectoActual){
        return res.status(400).json({ msg: 'Proyecto no encontrado' });
    }
    // Revisar si el proyecto pertenece al autor
    if (proyectoActual.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Crear nueva tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({tarea});
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Obtener tareas por proyectos
exports.obtenerTareas = async (req, res) => {

  try {
    // Extraer proyecto y comprobar si existe
    const {proyecto} = req.query;  
    
    const proyectoActual = await Proyecto.findById(proyecto);  
    if(!proyectoActual){
        return res.status(400).json({ msg: 'Proyecto no encontrado' });
    }
    // Revisar si el proyecto pertenece al autor
    if (proyectoActual.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Obtener tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Actualiza un proyecto
exports.actualizarTareas = async (req, res) => {
  // //Validar si hay errores
  // const errores = validationResult(req);
  // if (!errores.isEmpty()) {
  //   return res.status(400).json({ errores: errores.array() });
  // }
  try {
    // Extraer proyecto y comprobar si existe
    const {proyecto, nombre, estado} = req.body;  
    // Si la tarea existe
    let tareaActual = await Tarea.findById(req.params.id);  
    if (!tareaActual) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    // Extraer proyecto
    const proyectoActual = await Proyecto.findById(proyecto);  
    // Revisar si el proyecto pertenece al autor
    if (proyectoActual.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Crear un objeto con la nueva informacion
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre
    nuevaTarea.estado = estado
    // Guardar tarea
    tareaActual = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
    res.json({ tareaActual });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};

// Elimina una tarea
exports.eliminarTareas = async (req, res) => {
  try {
    // Extraer proyecto y comprobar si existe
    const {proyecto} = req.query;  
    // Si la tarea existe
    let tareaActual = await Tarea.findById(req.params.id);  
    if (!tareaActual) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    // Extraer proyecto
    const proyectoActual = await Proyecto.findById(proyecto);  
    // Revisar si el proyecto pertenece al autor
    if (proyectoActual.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Eliminar
    await Tarea.findOneAndRemove({_id: req.params.id});
    res.json({msg: 'Tarea Eliminada'});
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};
