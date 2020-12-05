'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var direccionUsuario =  prop.get('carpeta.imagenes.usuario')
var express = require('express');
var UsuarioController = require('../controller/usuarios'); // definir controlador
var auth = require('../middleware/authenticated');//definir autenticacion por tokent

var api = express.Router();
var multipart = require('connect-multiparty');//para trabajar con files
var data_uploadU = multipart({uploadDir:direccionUsuario});//seteando direccion de imagenes usuario

//diferentes metoodos rest del controlador
api.get('/test-usuario',auth.validateAuth,UsuarioController.test);
api.post('/usuarios',auth.validateAuth,UsuarioController.saveUsuario);
//api.post('/usuarios',UsuarioController.saveUsuario);
api.post('/login',UsuarioController.login);
api.put('/usuarios/:id',auth.validateAuth,UsuarioController.updateUsuario);
api.get('/validarUsuario',auth.validateAuth,UsuarioController.validarNombreUsuario);
api.post('/upload-image-usuario/:id',[auth.validateAuth,data_uploadU],UsuarioController.upImage);
api.get('/get-image-usuario/:imageFile',auth.validateAuth,UsuarioController.getImageFile);
api.get('/usuario/:id',auth.validateAuth,UsuarioController.getUsuario);
api.get('/usuarios/:page?',auth.validateAuth,UsuarioController.getUsuarios);
//api.delete('/usuarios/:id',auth.validateAuth,UsuarioController.deleteUsuario);

module.exports = api;