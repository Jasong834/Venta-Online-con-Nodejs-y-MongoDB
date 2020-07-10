'use strict'

var Carrito = require('../models/carrito')
var Producto = require('../models/producto')

function agregarCarrito(req,res) {
    var carrito = new Carrito();

    carrito.usuario = req.user.sub
    carrito.finalizado = false;

    carrito.save((err,carrito)=>{
        if(err) return res.status(500).send({message:'Error en la peticion del carrito'})
        if(!carrito) return res.status(404).send({message:'Error al guardar el carrito'})
        return res.status(200).send({carrito})
    })
}

function agregarProductosCarrito(req,res) {
    var usuarioId = req.params.idUsuario
    var carritoId = req.params.idCarrito;
    var params = req.body;

    var cantidadS = Number;
    var cantidadP = Number;
    var precio = Number;

    if (usuarioId != req.user.sub) {
        return res.status(500).send({message: 'No tiene permisos para agregar productos al carrito'})
    }

    Producto.findById(params.producto,(err,producto)=>{
        console.log(err)
        if(err) return res.status(500).send({message:'Error en la petcion del producto'})
        if(!producto) return res.status(404).send({message:'Error en los productos'})
        cantidadS= producto.cantidad
        precio = params.cantidad * producto.precio
        console.log(cantidadS)
        
        if(params.cantidad > cantidadS){
            console.log(cantidadS)
            return res.status(404).send({message:'No existen suficientes existencias del producto'})
        }else if(params.cantidad <= cantidadS){
            cantidadP = cantidadS - params.cantidad;
            Carrito.findOneAndUpdate({_id:carritoId},{$push:{productos:{producto:params.producto,cantidad:params.cantidad,precio:precio}}},{new:true},(err,carrito)=>{
                if(err) console.log(err)
                if(carrito){
                    var update = {}
                    if(cantidadP != null) update['cantidad'] = cantidadP;
                    Producto.findByIdAndUpdate(params.producto,update,(err,productoStock)=>{
                        if(err) console.log(err)
                        console.log(productoStock)
                    })
                }
                console.log(producto)
                return res.status(200).send({carrito})
            })

        }
    })

}

function editarProductoCarrito(req,res) {
    var usuarioId = req.params.idUsuario
    var carritoId = req.params.idCarrito;
    var params = req.body;

    var cantidadS = Number;
    var cantidadP = Number;
    var precio = Number;

    if (usuarioId != req.user.sub) {
        return res.status(500).send({message: 'No tiene permisos para agregar productos al carrito'})
    }

    Producto.findById(params.producto,(err,producto)=>{
        console.log(err)
        if(err) return res.status(500).send({message:'Error en la petcion del producto'})
        if(!producto) return res.status(404).send({message:'Error en los productos'})
        cantidadS= producto.cantidad
        precio = params.cantidad * producto.precio
        
        if(cantidadS != null){
            Carrito.findById(carritoId,{'productos.$':1},(err,carrito)=>{
                if(err) return console.log(err)
                cantidadP =carrito.productos.id(params.producto)
                console.log(cantidadP)
            })
        }
    })
}


module.exports = {
    agregarCarrito,
    agregarProductosCarrito,
    editarProductoCarrito
}