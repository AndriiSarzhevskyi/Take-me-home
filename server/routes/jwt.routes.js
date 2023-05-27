const express = require('express');
const auth = require('../midlware/auth.midlware');

var app = express();

app.get('/jwt', auth, async(req, res) =>{
      try{

      }
      catch(e){
        res.status(401).json({ message: 'Нет авторизации' })
    }
    });

  module.exports = app;