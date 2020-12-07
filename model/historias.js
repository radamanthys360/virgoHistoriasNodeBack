'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginatev2 = require('mongoose-paginate-v2');

var HistoriaSchema = Schema({
    fkUsuario : { type: Schema.ObjectId, ref: 'Usuarios'},
    ip : String,
    imagen : String,
    contenido : String,
    fechaCreacion : Date,
    valoracion : Number,
    numVisto : Number,
    activo : String,
    fkCategoria : { type: Schema.ObjectId, ref: 'Categorias'}
});

//activar paginado
HistoriaSchema.plugin(mongoosePaginatev2);

module.exports = mongoose.model('Historias',HistoriaSchema);