'use strict'
var jwt = require('jwt-simple');//para tokent
var moment = require('moment');//para manejar fechas
const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties

//servicio que nos ayuda a crear un tokent por medio de la data del usuario
exports.createToken = function(usuario){
 var  datos = {
     id: usuario.id,
     name: usuario.usuario,
     type: usuario.tipo,
     today: moment().unix(),//se le aplica la fecha actual
     exp: moment().add(5,'minutes').unix()//se vencera dentro de 5 minutos 
 };

 return jwt.encode(datos,prop.get('app.secreta'));
};