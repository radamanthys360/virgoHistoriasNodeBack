'use strict'

var mongoose = require('mongoose');
var mongoosePaginatev2 = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    usuario : String,
    clave : String,
    tipo : String,
    activo : String,
    ip : String,
    imagen : String
});

//activar paginado
UsuariosSchema.plugin(mongoosePaginatev2);

module.exports = mongoose.model('Usuarios',UsuariosSchema);