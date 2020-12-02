'use strict'
var jwt = require('jwt-simple');//para trabajar token
var moment = require('moment');//para trabajar fechas
const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties

//funcion para validar que todas las request que necesiten autorizacion
// lleven un token para poder acceder
exports.validateAuth = function(req,res,next){
    if(! req.headers.authorization){//si no lleva el header
        return res.status(403).send({message : prop.get('error.autorizacion')});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');//por si trae espacios 

    try{
        var data = jwt.decode(token,prop.get('app.secreta')); 
        if(data.exp <= moment().unix()){//se verifica si esta vigente
            res.status(401).send({message : prop.get('error.token.expirado ')});
        }

    }catch(ex){
        //console.log(ex);
        return  res.status(404).send({message : prop.get('error.token')});
    }
    req.usuario = data;
    next();
};