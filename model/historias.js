'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistoriaSchema = Schema({
    fkUsuario : { type: Schema.ObjectId, ref: 'Usuarios'},
    ip : String,
    imagen : String,
    contenido : String,
    fechaCreacion : Date,
    valoracion : Number,
    numVisto : Number,
    estado : String,
    fkCategoria : { type: Schema.ObjectId, ref: 'Categorias'}
});

module.exports = mongoose.model('Historias',HistoriaSchema);