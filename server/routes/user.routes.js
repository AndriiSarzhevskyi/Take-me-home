const express = require('express');
const jwt = require('jsonwebtoken')
const config = require('config')
// const { check, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
const formidableMiddleware = require('express-formidable');
const User = require('../models/user');
const Photo_avatar = require('../models/photo_avatar');
const auth = require('../midlware/auth.midlware');
// const fs = require('fs');
var router = express();
router.use(formidableMiddleware());

router.get('/:id', auth, async (req, res) => {
  try {
    console.log("here");
    const id = req.params.id;
    const user = await User.findOne({ where: { UserId: id } });
    const avatar = await Photo_avatar.findOne({ where: { UserUserId: id } });
    if (user) {
      console.log("start");
      res.status(201).json({ message: 'Дані отримано', name: user.name, surname: user.surname, age: user.age, gender: user.gender, email: user.email, photo_name: avatar.FileName, photo_path: avatar.ImagePath });
    };

  } catch (e) {
    res.status(500).json({ message: 'Щось пішло не за планом, спробуйте ще раз' })
  }
})

// router.post(
//   '/isadmin',
//   auth,
//   async (req, res) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1];
//       if (!token) {
//         return res.status(401).json({ message: 'Немає авторизації' })
//       }
//       const decoded = jwt.verify(token, config.get('jwtSecret'))
//       const check_user = decoded;

//       const user = await User.findOne({ where: { UserId: check_user.userId } });

//       if (user.Status == "admin") {
//         res.status(201).json({ message: 'Перевірку пройдено' });
//       }
//       else {
//         res.status(500).json({ message: 'Недостатньо прав користувача' });
//       }
//     }
//     catch (e) {
//       console.log(e);
//       res.status(500).json({ message: 'Недостатньо прав користувача' });
//     }
//   }
// )

// router.get(
//   '/getusers',
//   auth,
//   async (req, res) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1];
//       if (!token) {
//         return res.status(401).json({ message: 'Немає авторизації' })
//       }
//       const decoded = jwt.verify(token, config.get('jwtSecret'))
//       const check_user = decoded;

//       const user = await User.findOne({ where: { UserId: check_user.userId } });

//       if (user.Status == "admin") {

//         const users = await User.findAll({
//           order: [
//             ['createdAt', 'DESC']
//           ]
//         });

//         res.status(201).json({ message: 'Користувачів отримано', users: users });
//       }
//       else {
//         res.status(500).json({ message: 'Недостатньо прав користувача' });
//       }
//     }
//     catch (e) {
//       console.log(e);
//       res.status(500).json({ message: 'Помилка при отриманні користувачів' });
//     }
//   }
// )

module.exports = router