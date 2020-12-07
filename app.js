'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var usuario_routes = require('./routes/usuarios'); //ruta de usuarios
var categoria_routes = require('./routes/categorias');//ruta de categorias
var historias_routes = require('./routes/historias');//ruta de categorias

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cebeceras http
app.use((req, res, next) =>{
   res.header('Access-Control-Allow-Origin','*');
   res.header('Access-Control-Allow-Headers',
   'Authorization, X-API-KEY, Origin, X-Requested-with,Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
   res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
   next();
})

// rutas bases
app.use('/api',usuario_routes) //por ser estandar
app.use('/api',categoria_routes)
app.use('/api',historias_routes)

/* app.get('/inicio', function(req,res){
   res.status(200).send({message: 'Incicio restApi virgo historias'});
});
 */
module.exports = app;