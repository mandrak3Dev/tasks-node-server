const Proyecto = require("../models/Proyectos");
const { validationResult } = require("express-validator");

// Crear un proyecto
exports.crearProyecto = async (req, res) => {
  //Validar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Creat nuevo proyect0
    const proyecto = new Proyecto(req.body);
    // Guardar el creador
    proyecto.creador = req.usuario.id;
    //Guardar proyecto
    await proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Obtener proyectos del usuario autenticado
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Actualiza un proyecto
exports.actualizarProyectos = async (req, res) => {
  //Validar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // Extraer info del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // Revisar id
    let proyecto = await Proyecto.findById(req.params.id);
    // Revisar si existe proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Revisar si el creador es el autenticado
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Actualizar
    proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};

// Elimina un proyecto
exports.eliminarProyectos = async (req, res) => {
  try {
    // Revisar id
    let proyecto = await Proyecto.findById(req.params.id);
    // Revisar si existe proyecto
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    // Revisar si el creador es el autenticado
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // Eliminar el proyecto
    proyecto = await Proyecto.findOneAndRemove({_id: req.params.id });
    res.json({ msg: 'Proyecto eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};
