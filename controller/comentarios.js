'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var validator = require('validator'); // para validar la data
const Comentarios = require('../model/comentarios');
var moment = require('moment');//para manejar fechas
var fs = require('fs');//sistema de ficheros
var path = require('path');// trabajar con los path de los archivos y directorios

//creando funcion para testear controlador
function test(req,res){
    res.status(200).send({message: prop.get('comentario.test.mensaje')});
}

// function para guardar un nuevo registro
function saveComentario(req,res){
    var comentario = new Comentarios();
    var parametros = req.body;
    //console.log(parametros);
    if(validarComentario(parametros)){
        //para llenar foraneas solo se envian los ids
        comentario.contenido = parametros.contenido;
        comentario.fechaCreacion = moment().format();
        //Avar orden;
        //var orden = obtenerOrden(parametros.fkHistoria);
        obtenerOrden(parametros.fkHistoria).then(r =>{
            comentario.orden = r;
            comentario.respuestas = parametros.respuestas;
            comentario.positivo = 0;
            comentario.negativo = 0;
            comentario.fkUsuario = parametros.fkUsuario;
            comentario.fkHistoria = parametros.fkHistoria;
            comentario.save((err,comentarioStored) =>{
                if(err){//validando si existio un error
                    console.log(err);
                        res.status(500).send({message: prop.get('error.insertar')});
                }else{//validar si guardo el registro si devolvio el objeto cargado
                    if(!comentarioStored){
                        res.status(404).send({message: prop.get('error.insertar')});
                    }else{
                        res.status(200).send({message : {comentario: comentarioStored}});
                    }
                }
            });
          });
    }else{
        res.status(200).send({message: prop.get('error.validacion-general')});
    }
}

//valida data vacia 
function validarComentario(parametros) {
    if ((parametros.contenido === undefined || parametros.fkUsuario === undefined ||
         parametros.fkHistoria === undefined) ){
        return false;
    } else {
        // validando data obligatoria
        if ((!validator.isEmpty(parametros.contenido)) && 
            (!validator.isEmpty(parametros.fkUsuario)) &&
            (!validator.isEmpty(parametros.fkHistoria))) {
            return true;
        } else {
            return false;
        }
    }
}

//funcion para obtener el orden del registro
function obtenerOrden(fkHistoriaP) {
    return new Promise(function(resolve, reject) {
        Comentarios.countDocuments({fkHistoria : fkHistoriaP}, function( err, count){
            //console.log( "numero de comentarios : ", count );
            resolve((count + 1));
        });
    })
}

//para devolver un registro en especifico
function getComentario(req,res){
    var id = req.params.id;
    //Historias.findOne({_id: id,activo: 1}, (err, historiaGet) =>{
    Comentarios.findById(id, (err,comentarioGet) =>{
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')});
        }else{
            if(!comentarioGet){
                res.status(404).send({message: prop.get('historia.db.registro')});
            }else{
                res.status(200).send({comentario : comentarioGet});
            }
        }
    });
}

//trayendo todos paginados
function getComentarios(req,res){
    var parametros = req.body;
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var pagina = prop.get('registros.pagina.size');
    const CustomItems = {
        totalDocs: 'itemCount',
        docs: 'comentarios',
        limit: 'perPage',
        page: 'page',
        totalPages: 'pages',
    };
    //definir opciones de petición
    const options = { page: page, limit: pagina, sort: { orden: -1 }, customLabels: CustomItems };

    //paginar datos
    Comentarios.paginate({fkHistoria: parametros.fkHistoria}, options, (err, comentarioPag) => {
        if (err) return res.status(500).send({ message: prop.get('error.general.mongo')});

        if (!comentarioPag) return res.status(404).send({ message: prop.get('busqueda.lista.vacia') });

        return res.status(200).send({ comentarioPag });
    });
}

// guardando o actualizando la imagen
function upImage(req,res){
    var comentarioID = req.params.id;
    var file_name = prop.get('subir.imagenes.nombre');

    if(req.files){
        var file_path = req.files.image.path;//path completo de la imagen
        var file_split = file_path.split('\\');//para poder partir los datos
        var file_name = file_split[2];//nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];//extension de la imagen

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Comentarios.findByIdAndUpdate(comentarioID,{imagen: file_name}, (err, comentarioUpdate) =>{
                if(!comentarioUpdate){
                    res.status(404).send({message: prop.get('error.update')})
                }else{
                    res.status(200).send({comentario:comentarioUpdate})
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
    var direccion =  prop.get('carpeta.imagenes.comentario')

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
    saveComentario,
    getComentario,
    getComentarios,
    upImage,
    getImageFile

};