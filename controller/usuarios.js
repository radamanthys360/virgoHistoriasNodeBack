'use strict'

//creando funcion para testear controlador
function test(req,res){
    res.status(200).send({
        message: 'test controlador usuario'
    });
}

//exportamos la function para su uso
module.exports = {
    test
};