'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var express = require('express');
var CategoriaController = require('../controller/categoria'); // definir controlador
var auth = require('../middleware/authenticated');//definir autenticacion por tokent

var api = express.Router();

//diferentes metoodos rest del controlador
api.get('/test-categoria',auth.validateAuth,CategoriaController.test);
api.post('/categorias',auth.validateAuth,CategoriaController.saveCategoria);
api.put('/categorias/:id',auth.validateAuth,CategoriaController.updateCategoria);
api.get('/categoria/:id',auth.validateAuth,CategoriaController.getCategoria);
api.get('/categorias/:page?',auth.validateAuth,CategoriaController.getCategorias);

module.exports = api;