'use strict'

var bcrypt = require("bcrypt-nodejs");
var Usuario = require('../models/login')
var jwt = require("../services/jwt")


function registrarAdmin(req,res) {
    var usuario = new Usuario();
    var params = req.body;

    if (params.nombre && params.usuario && params.password) {
        usuario.nombre = params.nombre;
        usuario.usuario = params.usuario;
        usuario.email = params.email;
        usuario.rol = 'ROL_ADMIN';

        //Consulta base de datos
        Usuario.find({ $or: [  
            { usuario : usuario.usuario},
            { email : usuario.email }
        ]}).exec((err,usuarios)=>{
            if (err) return res.status(500).send({message : 'Error en la peticion del usuario'})

            if (usuarios && usuarios.length >= 1){
                return res.status(500).send({ message : 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    usuario.password = hash;
                    
                    usuario.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({message : 'Error al guardar el usuario'})

                        if(usuarioGuardado){
                            res.status(200).send({user : usuarioGuardado })
                        }else{
                            res.status(404).send({message : 'No se ha podido registrar el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({message : 'Rellene todos los datos necesarios'})
    }
}

function registrarUsuario(req,res) {
    var usuario = new Usuario();
    var params = req.body;

    if (params.nombre && params.usuario && params.password) {
        usuario.nombre = params.nombre;
        usuario.usuario = params.usuario;
        usuario.email = params.email;
        usuario.rol = 'ROL_USUARIO';

        //Consulta base de datos
        Usuario.find({ $or: [  
            { usuario : usuario.usuario},
            { email : usuario.email }
        ]}).exec((err,usuarios)=>{
            if (err) return res.status(500).send({message : 'Error en la peticion del usuario'})

            if (usuarios && usuarios.length >= 1){
                return res.status(500).send({ message : 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    usuario.password = hash;
                    
                    usuario.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({message : 'Error al guardar el usuario'})

                        if(usuarioGuardado){
                            res.status(200).send({user : usuarioGuardado })
                        }else{
                            res.status(404).send({message : 'No se ha podido registrar el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({message : 'Rellene todos los datos necesarios'})
    }
}

function login(req,res){
    var params = req.body;

    Usuario.findOne({email: params.email}, (err,usuario)=>{
        if (err) return res.status(500).send({message: 'Error de peticion'})

        if (usuario) {
            bcrypt.compare(params.password,usuario.password,(err,check)=>{
                if (check) {
                    if (params.getToken) {
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    }else{
                        usuario.password = undefined;
                        return res.status(200).send({usuario})
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'})
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'})
        }
    })

}


function editarUsuario(req,res) {
    var usuarioId = req.params.idUsuario;
    var params = req.body
    
    if (req.user.rol === "ROL_ADMIN" || usuarioId === req.user.sub) {
        Usuario.findByIdAndUpdate(usuarioId,params,{new: true},(err, usuarioActualizado)=>{
            if (err) return res.status(500).send({message: 'Error en la peticion'})
            if(!usuarioActualizado) return res.status(404).send({message: 'No se ha popido actualizar los datos del usuario'})
    
            return res.status(200).send({ usuario: usuarioActualizado })
        }) 
    }else{
        return res.status(404).send({message:'No tiene permisos para la accion solicitada'})
    }

}


function eliminarUsuario(req,res) {
    var usuarioId = req.params.idUsuario;

    if (req.user.rol === "ROL_ADMIN" || usuarioId === req.user.sub) {
        Usuario.findByIdAndDelete(usuarioId,(err,usuarioEliminado)=>{
            if(err) res.status(500).send({message: 'Error en la peticion'})
            if(!usuarioEliminado) return res.status(404).send({message: 'Error al eliminar el alumno'})
            return res.status(200).send({usuario: usuarioEliminado})
        })
    } else {
        return res.status(404).send({message:'No tiene permisos para la accion solicitada'})
    }

}


module.exports ={
    login,
    registrarAdmin,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario

}