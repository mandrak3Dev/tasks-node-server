const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer email y password
  const { email, password } = req.body;

  try {
    //Revisar q sea un usuario registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    // Revisar el password de usuario
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    //Si todo es correcto crear el jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //Firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confirmación
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({usuario});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'Hubo un error'})
  }
}