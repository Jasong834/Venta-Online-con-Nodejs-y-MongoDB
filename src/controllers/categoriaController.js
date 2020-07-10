'use strict'

var Categoria = require('../models/categoria');
var Producto = require('../models/producto');

function agregarCategoria(req,res) {
    var params = req.body;
    var categoria = new Categoria();

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar la categoria'})
    }else{
        if (params.nombre) {
            categoria.nombre = params.nombre,
            Categoria.find({$or:[
                {nombre:categoria.nombre}
            ]}).exec((err,categorias)=>{
                if (err) return res.status(500).send({message : 'Error en la peticion de la categoria'})

                if (categorias && categorias.length >= 1){
                    return res.status(500).send({ message : 'El producto ya existe'})
                }else{
                    categoria.save((err,categoria)=>{
                        if(err) return res.status(500).send({message : 'Error en la peticion de la categoria'})
                        if(!categoria) res.status(404).send({message:'Error al guardar la categoria'})
                        return res.status(200).send({categoria})
                    })
                }
            })
        }else{
            return res.status(404).send({message:'Llene todos los campos'})
        }
        

    }

}

function editarCategoria(req,res) {
    var params = req.body;
    var categoriaId = req.params.idCategoria

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar categorias'})
    }else{
        Categoria.findByIdAndUpdate(categoriaId,params,{new:true},(err,categoria)=>{
            if(err) res.status(500).send({message:'Error en la peticon de la categoria'})
            if(!categoria) res.status(404).send({message:'Error al editar la categoria'})
            return res.status(200).send({categoria})
        })

    }
}

function elimnarCategoria(req,res) {
    var categoriaId = req.params.idCategoria

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({message:'No tiene permisos para agregar categorias'})
    }else{
        Categoria.findByIdAndDelete(categoriaId,(err,categoria)=>{
            if(err) res.status(500).send({message:'Error en la peticon de la categoria'})
            if(!categoria) res.status(404).send({message:'Error al eliminar la categoria'})
            if (categoria) {
                var update ={}
                if(categoriaId) update['categoria'] = null 
                Producto.updateMany({'categoria':categoriaId},update,{new:true},(err,producto)=>{
                    if(err) return console.log(err)
                    return console.log(producto)
                });

            }
            return res.status(200).send({categoria}) 
        })

    }
}

function buscarPorCategoria(req,res) {
    var categoriaId = req.params.idCategoria;

    Producto.find({categoria:categoriaId},(err,productos)=>{
        if(err) return res.status(500).send({message:'Error en la peticion de los productos'})
        if(!productos) return res.status(404).send({message:'Error en la consulta de los productos'})
        return res.status(200).send({productos})
    })
}


module.exports={
    agregarCategoria,
    editarCategoria,
    elimnarCategoria,
    buscarPorCategoria
}