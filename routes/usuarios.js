'use strict'

var express = require('express');
var UsuarioController = require('../controller/usuarios'); // definir controlador

var api = express.Router();

// definimos metodo get con el siguiente maping a referencia dle metodo 
//del controlador
api.get('/test-usuario',UsuarioController.test);

module.exports = api;