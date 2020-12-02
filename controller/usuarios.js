'use strict'
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../model/usuarios');
const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var validator = require('validator'); // para validar la data
var tokentJwt = require('../services/jwt'); // para token
const usuarios = require('../model/usuarios');
var fs = require('fs');//sistema de ficheros
var path = require('path');// trabajar con los path de los archivos y directorios


//creando funcion para testear controlador
function test(req,res){
    res.status(200).send({message: prop.get('usuario.test.mensaje')});
}

// function para guardar un nuevo registro
function saveUsuario(req,res){
    var usuario = new Usuario();
    var parametros = req.body;
    console.log(parametros);
    if(validarUsuario(parametros)){
        usuario.usuario = parametros.usuario;
        usuario.tipo = parametros.tipo;
        usuario.activo = '1';
       //Encriptar
       bcrypt.hash(parametros.clave,null,null, function(err,hash){
            usuario.clave = hash;
            //guardar el registro
            usuario.save((err,usuarioStored) =>{
            if(err){//validando si existio un error
                    res.status(500).send({message: prop.get('error.insertar')});
            }else{//validar si guardo el registro si devolvio el objeto cargado
                if(!usuarioStored){
                    res.status(404).send({message: prop.get('error.insertar')});
                }else{
                    res.status(200).send({message : {usuario: usuarioStored}});
                }
            }
        });
       });
    }else{
        res.status(200).send({message: prop.get('error.validacion-general')});
    }
}

//para verificar credenciales
function login(req,res){
    var parametros = req.body;

    var usuario = parametros.usuario;
    var clave = parametros.clave;

    Usuario.findOne({usuario: usuario}, (err, usuario) =>{
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')});
        }else{
            if(! usuario){
                res.status(400).send({message: prop.get('usuario.db.login')});
            }else{
                //validando contraseña
                bcrypt.compare(clave, usuario.clave, function(err,check){
                  if(check){
                    //devolver los datos del usuario logeado
                    if(parametros.gethash){
                        //devolver un token jwt 
                        res.status(200).send({token : tokentJwt.createToken(usuario)});
                    }else{
                        res.status(200).send({usuario});
                    }
                  }else{
                    res.status(400).send({message: prop.get('usuario.db.login404')});
                  }
                });
            }
        }
    });
}

//actualizar usuario
function updateUsuario(req,res){
    var id = req.params.id; // recogiendo el id de la url
    var update = req.body;

    usuarios.findByIdAndUpdate(id,update, (err, usuarioUpdate) => {
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')})
        }else{
            if(!usuarioUpdate){
                res.status(404).send({message: prop.get('error.update')})
            }else{
                res.status(200).send({usuario:usuarioUpdate})
            }
        }
    });
}

//valida data vacia 
function validarUsuario(parametros) {
    //validando estructura obligatoria (clave-usuario.tipo)
    if ((parametros.clave === undefined || parametros.usuario === undefined || parametros.tipo === undefined ||
         parametros.ip === undefined)) {
        return false;
    } else {
        // validando data obligatoria
        if ((!validator.isEmpty(parametros.clave)) &&
            (!validator.isEmpty(parametros.usuario)) &&
            (!validator.isEmpty(parametros.tipo)) &&
            (!validator.isEmpty(parametros.ip))
            ) {
            return true;
        } else {
            return false;
        }
    }
}

//valida si el usuario ya existe dentro de la base de datos
function validarNombreUsuario(req,res){
    var parametros = req.body;
    var nombreUsuario = parametros.usuario;
    Usuario.findOne({usuario: nombreUsuario}, (err, usuario) =>{
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')});
        }else{
            if(! usuario){
                res.status(200).send({message: prop.get('usuario.db.validarB')});
            }else{
                res.status(200).send({message: prop.get('usuario.db.validarM')});
            }
        }
    });
}

// guardando o actualizando la imagen
function upImage(req,res){
    var usuarioID = req.params.id;
    var file_name = prop.get('subir.imagenes.nombre');

    if(req.files){
        var file_path = req.files.image.path;//path completo de la imagen
        var file_split = file_path.split('\\');//para poder partir los datos
        var file_name = file_split[2];//nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];//extension de la imagen

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            usuarios.findByIdAndUpdate(usuarioID,{imagen: file_name}, (err, usuarioUpdate) =>{
                if(!usuarioUpdate){
                    res.status(404).send({message: prop.get('error.update')})
                }else{
                    res.status(200).send({usuario:usuarioUpdate})
                }
            });
        }else{
            res.status(404).send({message : prop.get('subir.imagenes.ext')});
        }

    }else{
        res.status(200).send({message: prop.get('subir.imagenes.no')});
    }
}

//para devolver la imagen del usuario
function getImageFile(req,res){
    var imageFile = req.params.imageFile;//se recibe el nombre de la imagen
    var direccion =  prop.get('carpeta.imagenes.usuario')

    fs.stat(direccion+imageFile, function (existe){
        if(!existe){//si existe
            res.sendFile(path.resolve(direccion+imageFile));
        }else{
            res.status(200).send({message: prop.get('subir.imagenes.noexiste')});
        }
    });
}



//exportamos la function para su uso
module.exports = {
    test,
    saveUsuario,
    login,
    updateUsuario,
    validarNombreUsuario,
    upImage,
    getImageFile
};