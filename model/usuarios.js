'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    usuario : String,
    clave : String,
    tipo : String,
    activo : String
});

module.exports = mongoose.model('Usuarios',UsuariosSchema);