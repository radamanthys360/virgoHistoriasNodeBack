'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginatev2 = require('mongoose-paginate-v2');

var ComentarioSchema = Schema({
    contenido : String,
    respuestas : [String],
    fechaCreacion : Date,
    orden : Number,
    positivo : Number,
    negativo : Number,
    imagen : String,
    //campoLink : String,
    fkUsuario : { type: Schema.ObjectId, ref: 'Usuarios'},
    fkHistoria : { type: Schema.ObjectId, ref: 'Historias'}
});

//activar paginado
ComentarioSchema.plugin(mongoosePaginatev2);

module.exports = mongoose.model('Comentarios',ComentarioSchema);