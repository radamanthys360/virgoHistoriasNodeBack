'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginatev2 = require('mongoose-paginate-v2');

var CategoriaSchema = Schema({
    nombre : String,
    activo : String
});

//activar paginado
CategoriaSchema.plugin(mongoosePaginatev2);

module.exports = mongoose.model('Categorias',CategoriaSchema);