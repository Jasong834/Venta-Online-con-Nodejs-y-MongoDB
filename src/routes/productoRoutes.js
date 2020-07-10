'use strict'

var express = require("express")
var productoContoller = require("../controllers/productoController")
var md_auth = require("../middlewares/authenticated")



//Rutas

var api = express.Router()
api.post('/agregar-producto/:idCategoria',md_auth.ensureAuth,productoContoller.agregarProducto);
api.put('/editar-producto/:idProducto',md_auth.ensureAuth,productoContoller.editarProducto);
api.delete('/eliminar-producto/:idProducto',md_auth.ensureAuth,productoContoller.eliminarProducto);
api.get('/buscar-producto/:idProducto',productoContoller.buscarById);
api.get('/agotados',productoContoller.agotados)



module.exports = api;