const express = require('express');
const { check, validationResult } = require('express-validator');
const formidableMiddleware = require('express-formidable');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('config')
// const auth = require('../midlware/auth.midlware')

var app = express();
app.use(formidableMiddleware());

app.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req.fields);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некоректні дані при реєстрації'
        })
      }

      const { email, password } = req.fields;
      const user = await User.findOne({ where: { email: email } });
      if (user == null) {
        return res.status(400).json({ errors: errors.array(), message: 'Користувача з такою електронною адресою не існує' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Невірний пароль, спробуйте знову' })
      }
      console.log(user.UserId);
      const token = jwt.sign(
        { userId: user.UserId },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )
      res.json({ token, userId: user.UserId, name: user.name, status:  user.Status})

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

module.exports = app;