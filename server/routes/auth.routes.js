const express = require('express');
const bcrypt = require('bcryptjs');
const Base64 = require('js-base64');
const { check, validationResult } = require('express-validator');
const auth = require('../midlware/auth.midlware');
const { IncomingForm } = require('formidable');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const User = require('../models/user');
const Photo_avatar = require('../models/photo_avatar');


var app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static(`${__dirname}/files`));

const isFileValid = (file) => {
  const type = file.type.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "gif"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

app.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 8 символов')
      .isLength({ min: 8 })
  ],

  async (req, res) => {

    try {
      const form = new IncomingForm();
      // const uploadFolder = path.join(__dirname, "../files", "avatars");
      const uploadFolder = path.join(__dirname, "../upload_avatar");
      form.multiples = true;
      form.maxFileSize = 50 * 1024 * 1024; // 5MB
      form.uploadDir = uploadFolder;

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
        const file = files.photo;
        const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

        if (!files.photo.length) {

          const isValid = isFileValid(file);
          if (!isValid) {
            return res.status(400).json({
              message: "The file type is not a valid type"
            });
          }
        }

        const { name, surname, age, gender, email, password, photobase64 } = fields;
        const errors = validationResult(fields)
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: 'Некорректный данные при регистрации'
          })
        }
        const candidate = await User.findOne({ where: { email: email } });
        if (candidate != null) {
          return res.status(400).json({ errors: errors.array(), message: 'Користувач з такою електронною адресою вже існує' })
        }

        if (candidate === null) {
          const hashedPassword = await bcrypt.hash(password, 12);


          User.create({
            name: name,
            surname: surname,
            email: email,
            password: hashedPassword,
            age: age,
            gender: gender,
            Status: "user"
          }).then((record) => {
            const newfileName = record.UserId + fileName;
            let newpath = path.join(uploadFolder, newfileName);
            fs.renameSync(file.path, newpath);
            newpath = "/upload_avatar/" + newfileName;
            Photo_avatar.create({
              UserUserId: record.UserId,
              FileName: newfileName,
              Title: record.name + ".avatar",
              ImagePath: newpath,
              ImageData: newpath
            });
          })
          res.status(201).json({ message: 'Пользователь создан' })
        }
      });
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  });


app.post('/updateinfo/:id',
  [check('email', 'Некорректный email').isEmail()],
  auth,
  async (req, res) => {
    try {
      const form = new IncomingForm();
      const uploadFolder = path.join(__dirname, "../upload_avatar");
      form.multiples = true;
      form.maxFileSize = 50 * 1024 * 1024; // 5MB
      form.uploadDir = uploadFolder;

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            status: "Fail",
            message: "Помилка при зчитуванні файлу",
            error: err,
          });
        }
        const id = req.params.id;
        const errors = validationResult(fields)
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: 'Некорректні дані'
          })
        }
        const file = files.photo;
        const { name, surname, age, gender, email } = fields;
        console.log(id);
        console.log(name);
        const user = await User.findOne({ where: { UserId: id } });

        user.update({
          name: name,
          surname: surname,
          email: email,
          gender: gender
        });
        console.log(file.size);
        if (file.size > 0) {
          const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

          if (!files.photo.length) {

            const isValid = isFileValid(file);
            if (!isValid) {
              return res.status(400).json({
                message: "Некоректний формат файлу"
              });
            }
          }
          const avatar = await Photo_avatar.findOne({ where: { UserUserId: id } });

          fs.unlink(path.join(uploadFolder, avatar.FileName), (err) => { if (err) throw err; });

          const newfileName = user.UserId + fileName;
          let newpath = path.join(uploadFolder, newfileName);
          fs.renameSync(file.path, newpath);
          newpath = "/upload_avatar/"+newfileName;
          avatar.update({
            FileName: newfileName,
            ImagePath: newpath,
            ImageData: newpath
          })
        }

        res.status(201).json({ message: 'Дані оновлено', name: user.name});

      });
    }
    catch (e) {
      res.status(500).json({ message: 'Щось пішло не за планом, спрообуйте знову' })
    }
  });

module.exports = app;