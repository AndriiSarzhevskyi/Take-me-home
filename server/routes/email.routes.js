const express = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const formidableMiddleware = require('express-formidable');
const nodemailer = require('nodemailer')
const User = require('../models/user');
const config = require('../config/email.json');


var app = express();
app.use(formidableMiddleware());


const isFileValid = (file) => {
  const type = file.type.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "gif"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

let codemail;
app.post(
  '/sendkode',
  [
    check('email', 'Некоректний email').isEmail(),
    check('password', 'Мінімальна довжина пароля 8 символів')
      .isLength({ min: 8 })
 ],
  async(req,res) =>{
    try{
      const errors = validationResult(req.fields);
      if (!errors.isEmpty()) {
          return res.status(400).json({
          errors: errors.array(),
          message: 'Некоректні дані при реєстрації'
        })
      }
      const {email} = req.fields;
      const file = req.files.photo;
      
      const candidate = await User.findOne({where: {email: email}});
      if(candidate != null){
        return res.status(400).json({errors: errors.array(), message: 'Користувач з такою електронною адресою вже існує'})
      } 

      if(candidate === null){
        const isValid = isFileValid(file);
        if (!isValid) {
          return res.status(400).json({
            message: "The file type is not a valid type"
          });
        }
          const transporter = nodemailer.createTransport({
              host: config.host, 
              port: config.port, 
              auth: {
                user: config.user_email,
                pass: config.password 
              }
            });
          let code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
          codemail = code;
          const mailOptions = {
            from: config.user_email,
            to: email,
            subject: 'Take me home',
            text: 'Для підтвердження дії на сайті Take me home введіть наступний код: ' + code
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            } else {
            }
          });
          res.status(201).json({ message: 'Повідомлення надіслано', code: code})
        }
      }
    catch(e){
      res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
    }
  }
)

app.post(
  '/sendforgotkode',
  [
    check('email', 'Некоректний email').isEmail(),

 ],
  async(req,res) =>{
    try{
      const errors = validationResult(req.fields);
      if (!errors.isEmpty()) {
          return res.status(400).json({
          errors: errors.array(),
          message: 'Некоректна адреса електронної пошти'
        })
      }
      const {email} = req.fields; 
      const candidate = await User.findOne({where: {email: email}});
      if(candidate === null){
        return res.status(400).json({errors: errors.array(), message: 'Користувач з такою електронною адресою не існує'})
      } 
      if(candidate != null){
        const transporter = nodemailer.createTransport({
            host: config.host, 
            port: config.port, 
            auth: {
              user: config.user_email,
              pass: config.password 
            }
        });
          let code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
          codemail = code;
          const mailOptions = {
            from: config.user_email,
            to: email,
            subject: 'Take me home',
            text: 'Для підтвердження дії на сайті Take me home введіть наступний код: ' + code
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            } else {
            }
          });
          res.status(201).json({ message: 'Повідомлення надіслано', code: code})
        }
      }
    catch(e){
      res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
    }
  }
)

app.post(
  "/resetpassword",
  [
    check('password1', 'Мінімальна довжина пароля 8 символів')
      .isLength({ min: 8 }),
    check('password2', 'Мінімальна довжина пароля 8 символів')
      .isLength({ min: 8 })
  ],
  async(req,res) =>{
    try{
      const {password1, password2, email} = req.fields;
      
      const errors = validationResult(req.fields);
      if (!errors.isEmpty()) {
        return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректні дані'
      });
      }
      const candidate = await User.findOne({where: {email: email}});
      if(candidate === null){
        return res.status(400).json({errors: errors.array(), message: 'Користувач з такою електронною адресою не існує'})
      } 
      if(candidate != null){
        if(password1 != password2){
          return res.status(400).json({errors: errors.array(), message: 'Паролі не співпадають'});
        }
        const hashedPassword = await bcrypt.hash(password1, 12);
          const result = await User.update(
            { password: hashedPassword },
            { where: { UserId:  candidate.UserId} }
          )
        res.status(201).json({ message: 'Пароль успішно змінено'})
      }
    }
    catch(e){
      res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
    }
  }
)

module.exports = app;