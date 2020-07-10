'use strict'

var express = require("express")
var categoriaController = require("../controllers/categoriaController")
var md_auth = require("../middlewares/authenticated")



//Rutas

var api = express.Router()
api.post('/agregar-categoria',md_auth.ensureAuth,categoriaController.agregarCategoria);
api.put('/editar-categoria/:idCategoria',md_auth.ensureAuth,categoriaController.editarCategoria);
api.delete('/eliminar-categoria/:idCategoria',md_auth.ensureAuth,categoriaController.elimnarCategoria);
api.get('/buscar-productos-categoria/:idCategoria',categoriaController.buscarPorCategoria);




module.exports = api;