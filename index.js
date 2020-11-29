'use strict'

var moongose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3880;

moongose.connect('mongodb://localhost:27017/virgohistorias',(err,res) =>{
  if(err){
      throw err;
  }else{
      console.log('conexion establecida correctamente ....');

      app.listen(port,function (){
        console.log('servidor para api rest virgohistoria listo en http://localhost:'+port);
      });
  }
});