'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var express = require('express');
var ComentarioController = require('../controller/comentarios'); // definir controlador
var auth = require('../middleware/authenticated');//definir autenticacion por tokent
var direccionComentario =  prop.get('carpeta.imagenes.comentario')

var api = express.Router();
var multipart = require('connect-multiparty');//para trabajar con files
var data_uploadC = multipart({uploadDir:direccionComentario});//seteando direccion de imagenes usuario

//diferentes metoodos rest del controlador
api.get('/test-comentario',auth.validateAuth,ComentarioController.test);
api.post('/comentarios',auth.validateAuth,ComentarioController.saveComentario);
//api.put('/historias/:id',auth.validateAuth,HistoriaController.updateHistoria);
api.get('/comentario/:id',auth.validateAuth,ComentarioController.getComentario);
api.get('/comentarios/:page?',auth.validateAuth,ComentarioController.getComentarios);
api.post('/upload-image-comentario/:id',[auth.validateAuth,data_uploadC],ComentarioController.upImage);
api.get('/get-image-comentario/:imageFile',auth.validateAuth,ComentarioController.getImageFile);

module.exports = api;