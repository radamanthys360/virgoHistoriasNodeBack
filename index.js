'use strict'

var moongose = require('mongoose');

moongose.connect('mongodb://localhost:27017/virgohistorias',(err,res) =>{
  if(err){
      throw err;
  }else{
      console.log('conexion establecida correctamente ....');
  }
});