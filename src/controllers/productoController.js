'use strict'

var Producto = require('../models/producto')

function agregarProducto(req,res) {
    var producto = new Producto();
    var params = req.body;
    var categoriaId = req.params.idCategoria;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar productos'})
    }else{
        if (params.nombre && params.precio && params.cantidad && categoriaId) {
            producto.nombre = params.nombre,
            producto.descripcion = params.descripcion,
            producto.precio = params.precio,
            producto.cantidad = params.cantidad,
            producto.categoria = categoriaId   
            
            producto.save((err,producto)=>{
                if(err) return res.status(500).send({message : 'Error en la peticion del producto'})
                if(!producto) res.status(404).send({message:'Error al guardar el producto'})
                return res.status(200).send({producto})
            })
            
            
        }else{
            return res.status(404).send({message:'Llene todos los campos'})
        }
    }
}

function editarProducto(req,res) {
    var params = req.body;
    var productoId = req.params.idProducto;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar productos'})
    }

    Producto.findByIdAndUpdate(productoId,params,{new:true},(err,producto)=>{
        if(err) return res.status(500).send({message:'Error en la peticion del producto'})
        if(!producto) return res.status(404).send({message:'No se ha podido actualizar el producto'})
        return res.status(200).send({producto})
    })
}

function eliminarProducto(req,res) {
    var productoId = req.params.idProducto;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar productos'})
    }

    Producto.findByIdAndDelete(productoId,(err,producto)=>{
        if(err) return res.status(500).send({message:'Error en la peticion del producto'})
        if(!producto) return res.status(404).send({message:'No se pudo eliminar el producto'})
        return res.status(200).send({producto})
    })
}

function buscarById(req,res) {
    var productoId = req.params.idProducto;

    Producto.findById(productoId,(err,empleado)=>{
        if(err) return res.status(500).send({message:'Error en la consulta del producto'})
        if(!empleado) return res.status(404).send({message:'error el encontrar el producto'})
        return res.status(200).send({empleado})
    })
}

function agotados(req,res) {

    Producto.find({cantidad:0},(err,producto)=>{
        if(err) return res.status(500).send({message:'Error en la peticion del producto'})
        if(!producto) return res.status(404).send({message:'Error en la consulta del producto'})
        return res.status(200).send({producto})
    })
}

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProducto,
    buscarById,
    agotados
}