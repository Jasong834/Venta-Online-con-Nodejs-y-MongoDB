'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    usuario:{type:Schema.ObjectId,ref:'usuario'},
    productos:[{
        produto:{type:Schema.ObjectId,ref:'producto'},
        cantidad:Number,
        precio:Number
    }],
    finalizado:Boolean
})

module.exports = mongoose.model('carrito',CarritoSchema)