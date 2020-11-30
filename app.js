'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var usuario_routes = require('./routes/usuarios'); //ruta de usuarios

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar http
// rutas bases
app.use('/api',usuario_routes) //por ser estandar

/* app.get('/inicio', function(req,res){
   res.status(200).send({message: 'Incicio restApi virgo historias'});
});
 */
module.exports = app;