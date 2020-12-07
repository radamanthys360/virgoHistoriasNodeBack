'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var express = require('express');
var HistoriaController = require('../controller/historias'); // definir controlador
var auth = require('../middleware/authenticated');//definir autenticacion por tokent
var direccionHistorias =  prop.get('carpeta.imagenes.historias')

var api = express.Router();
var multipart = require('connect-multiparty');//para trabajar con files
var data_uploadH = multipart({uploadDir:direccionHistorias});//seteando direccion de imagenes usuario


//diferentes metoodos rest del controlador
api.get('/test-historia',auth.validateAuth,HistoriaController.test);
api.post('/historias',auth.validateAuth,HistoriaController.saveHistoria);
api.put('/historias/:id',auth.validateAuth,HistoriaController.updateHistoria);
api.get('/historia/:id',auth.validateAuth,HistoriaController.getHistoria);
api.get('/historias/:page?',auth.validateAuth,HistoriaController.getHistorias);
api.post('/upload-image-historia/:id',[auth.validateAuth,data_uploadH],HistoriaController.upImage);
api.get('/get-image-historia/:imageFile',auth.validateAuth,HistoriaController.getImageFile);

module.exports = api;