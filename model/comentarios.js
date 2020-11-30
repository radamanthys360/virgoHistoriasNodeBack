'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioSchema = Schema({
    contenido : String,
    identificador : String,
    respuestas : String,
    fechaCreacion : Date,
    orden : Number,
    fkUsuario : { type: Schema.ObjectId, ref: 'Usuarios'},
    fkHistoria : { type: Schema.ObjectId, ref: 'Historias'}
});

module.exports = mongoose.model('Comentarios',ComentarioSchema);