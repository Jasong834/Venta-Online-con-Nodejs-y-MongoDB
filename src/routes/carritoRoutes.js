'use strict'

var express = require("express")
var carritoController = require("../controllers/carritoController")
var md_auth = require("../middlewares/authenticated")



//Rutas

var api = express.Router()
api.post('/crear-carrito',md_auth.ensureAuth,carritoController.agregarCarrito);
api.put('/productos-carrito/:idUsuario/:idCarrito',md_auth.ensureAuth,carritoController.agregarProductosCarrito)
api.put('/editar-carrito/:idUsuario/:idCarrito',md_auth.ensureAuth,carritoController.editarProductoCarrito)





module.exports = api;