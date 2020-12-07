'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var validator = require('validator'); // para validar la data
const Historias = require('../model/historias');
var moment = require('moment');//para manejar fechas
var fs = require('fs');//sistema de ficheros
var path = require('path');// trabajar con los path de los archivos y directorios


//creando funcion para testear controlador
function test(req,res){
    res.status(200).send({message: prop.get('categoria.test.mensaje')});
}

// function para guardar un nuevo registro
function saveHistoria(req,res){
    //moment().locale('nl-be');
    var historia = new Historias();
    var parametros = req.body;
    //console.log(parametros);
    if(validarHistoria(parametros)){
        //para llenar foraneas solo se envian los ids
        historia.fkUsuario = parametros.fkUsuario;
        historia.ip = parametros.ip;
        historia.contenido = parametros.contenido;
        historia.fechaCreacion = moment().format();
        historia.valoracion = 0;
        historia.numVisto = 0;
        historia.imagen = '';
        historia.fkCategoria = parametros.fkCategoria;
        historia.activo = '1';
        //console.log(categoria);
        historia.save((err,HistoriaStored) =>{
            if(err){//validando si existio un error
                    res.status(500).send({message: prop.get('error.insertar')});
            }else{//validar si guardo el registro si devolvio el objeto cargado
                if(!HistoriaStored){
                    res.status(404).send({message: prop.get('error.insertar')});
                }else{
                    res.status(200).send({message : {historia: HistoriaStored}});
                }
            }
        });
    }else{
        res.status(200).send({message: prop.get('error.validacion-general')});
    }
}

//valida data vacia 
function validarHistoria(parametros) {
    //validando estructura obligatoria (clave-usuario.tipo)
    if ((parametros.fkUsuario === undefined || parametros.ip === undefined ||
         parametros.contenido === undefined || parametros.fkCategoria === undefined)) {
        return false;
    } else {
        // validando data obligatoria
        if ((!validator.isEmpty(parametros.fkUsuario)) && 
            (!validator.isEmpty(parametros.ip)) &&
            (!validator.isEmpty(parametros.contenido)) &&
            (!validator.isEmpty(parametros.fkCategoria))
           ) {
            return true;
        } else {
            return false;
        }
    }
}

//actualizar usuario
function updateHistoria(req,res){
    var id = req.params.id; // recogiendo el id de la url
    var update = req.body;

    Historias.findByIdAndUpdate(id,update, (err, historiaUpdate) => {
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')})
        }else{
            if(!historiaUpdate){
                res.status(404).send({message: prop.get('error.update')})
            }else{
                res.status(200).send({historia:historiaUpdate})
            }
        }
    });
}

//para devolver un registro en especifico
function getHistoria(req,res){
    var id = req.params.id;
    Historias.findOne({_id: id,activo: 1}, (err, historiaGet) =>{
 //   Categorias.findById(id, (err,categoriaGet) =>{
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')});
        }else{
            if(!historiaGet){
                res.status(404).send({message: prop.get('categoria.db.registro')});
            }else{
                res.status(200).send({historia : historiaGet});
            }
        }
    });
}

//trayendo todos paginados
function getHistorias(req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var pagina = prop.get('registros.pagina.size');
    const CustomItems = {
        totalDocs: 'itemCount',
        docs: 'historias',
        limit: 'perPage',
        page: 'page',
        totalPages: 'pages',
    };
    //definir opciones de petición
    const options = { page: page, limit: pagina, sort: 'fechaCreacion', customLabels: CustomItems };

    //paginar datos
    Historias.paginate({activo: 1}, options, (err, historiasPag) => {
        if (err) return res.status(500).send({ message: prop.get('error.general.mongo')});

        if (!historiasPag) return res.status(404).send({ message: prop.get('busqueda.lista.vacia') });

        return res.status(200).send({ historiasPag });
    });
}

// guardando o actualizando la imagen
function upImage(req,res){
    var historiaID = req.params.id;
    var file_name = prop.get('subir.imagenes.nombre');

    if(req.files){
        var file_path = req.files.image.path;//path completo de la imagen
        var file_split = file_path.split('\\');//para poder partir los datos
        var file_name = file_split[2];//nombre del archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];//extension de la imagen

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Historias.findByIdAndUpdate(historiaID,{imagen: file_name}, (err, historiaUpdate) =>{
                if(!historiaUpdate){
                    res.status(404).send({message: prop.get('error.update')})
                }else{
                    res.status(200).send({usuario:historiaUpdate})
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
    var direccion =  prop.get('carpeta.imagenes.historias')

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
    saveHistoria,
    updateHistoria,
    getHistoria,
    getHistorias,
    upImage,
    getImageFile

};