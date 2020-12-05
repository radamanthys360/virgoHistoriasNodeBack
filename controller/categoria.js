'use strict'

const PropertiesReader = require('properties-reader');//para leer un properties
const prop = PropertiesReader('app.properties'); //cargando nuestro properties
var validator = require('validator'); // para validar la data
const Categorias = require('../model/categorias');

//creando funcion para testear controlador
function test(req,res){
    res.status(200).send({message: prop.get('categoria.test.mensaje')});
}

// function para guardar un nuevo registro
function saveCategoria(req,res){
    var categoria = new Categorias();
    var parametros = req.body;
    //console.log(parametros);
    if(validarCategoria(parametros)){
        categoria.nombre = parametros.nombre;
        categoria.activo = '1';
        categoria.save((err,CategoriaStored) =>{
            if(err){//validando si existio un error
                    res.status(500).send({message: prop.get('error.insertar')});
            }else{//validar si guardo el registro si devolvio el objeto cargado
                if(!CategoriaStored){
                    res.status(404).send({message: prop.get('error.insertar')});
                }else{
                    res.status(200).send({message : {categoria: CategoriaStored}});
                }
            }
        });
    }else{
        res.status(200).send({message: prop.get('error.validacion-general')});
    }
}

//valida data vacia 
function validarCategoria(parametros) {
    //validando estructura obligatoria (clave-usuario.tipo)
    if ((parametros.nombre === undefined)) {
        return false;
    } else {
        // validando data obligatoria
        if ((!validator.isEmpty(parametros.nombre))) {
            return true;
        } else {
            return false;
        }
    }
}

//actualizar usuario
function updateCategoria(req,res){
    var id = req.params.id; // recogiendo el id de la url
    var update = req.body;

    Categorias.findByIdAndUpdate(id,update, (err, categoriaUpdate) => {
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')})
        }else{
            if(!categoriaUpdate){
                res.status(404).send({message: prop.get('error.update')})
            }else{
                res.status(200).send({usuario:categoriaUpdate})
            }
        }
    });
}

//para devolver un registro en especifico
function getCategoria(req,res){
    var id = req.params.id;

    Categorias.findById(id, (err,categoriaGet) =>{
        if(err){
            res.status(500).send({message: prop.get('error.general.mongo')});
        }else{
            if(!categoriaGet){
                res.status(404).send({message: prop.get('usuario.db.login')});
            }else{
                res.status(200).send({usuario : categoriaGet});
            }
        }
    });
}

//trayendo todos paginados
function getCategorias(req,res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var pagina = prop.get('registros.pagina.size');
    const CustomItems = {
        totalDocs: 'itemCount',
        docs: 'categorias',
        limit: 'perPage',
        page: 'page',
        totalPages: 'pages',
    };
    //definir opciones de petición
    const options = { page: page, limit: pagina, sort: 'nombre', customLabels: CustomItems };

    //paginar datos
    Categorias.paginate({}, options, (err, categoriasPag) => {
        if (err) return res.status(500).send({ message: prop.get('error.general.mongo')});

        if (!categoriasPag) return res.status(404).send({ message: prop.get('busqueda.lista.vacia') });

        return res.status(200).send({ categoriasPag });
    });
}



//exportamos la function para su uso
module.exports = {
    test,
    saveCategoria,
    updateCategoria,
    getCategoria,
    getCategorias

};