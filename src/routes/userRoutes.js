'use strict'

var express = require("express")
var loginController = require("../controllers/loginController")
var md_auth = require("../middlewares/authenticated")



//Rutas

var api = express.Router()
api.post('/registrar-admin',loginController.registrarAdmin);
api.post('/registrar-usuario',loginController.registrarUsuario);
api.post('/login',loginController.login);
api.put('/editar-usuario/:idUsuario',md_auth.ensureAuth,loginController.editarUsuario);
api.delete('/eliminar-usuario/:idUsuario',md_auth.ensureAuth,loginController.eliminarUsuario);



module.exports = api;