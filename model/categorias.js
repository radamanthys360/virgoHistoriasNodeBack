'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre : String,
    activa : String
});

module.exports = mongoose.model('Categorias',CategoriaSchema);