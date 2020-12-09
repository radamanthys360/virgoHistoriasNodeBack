'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var moongose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || prop.get('db.puerto');
//var uri = prop.get('db.cadena.con');
var uri = prop.get('db.cadena.remoto');

//conexion local
//moongose.connect(uri,{ useNewUrlParser: true, useFindAndModify: false,useUnifiedTopology: true},(err,res) =>{
//conexion remota
moongose.connect(uri, { authSource:"admin",useNewUrlParser: true, useFindAndModify: false, 
                        useUnifiedTopology: true }, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log(prop.get('db.mensaje.exito'));

    app.listen(port, function () {
      console.log(prop.get('db.mensaje.inicio'));
    });
  }
});