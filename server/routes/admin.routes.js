const express = require('express');
const jwt = require('jsonwebtoken')
const config = require('config')
const formidableMiddleware = require('express-formidable');
const User = require('../models/user');
const Photo_avatar = require('../models/photo_avatar');
const Ad = require('../models/ad');
const Comment = require('../models/comment');
const Pet = require('../models/pet');
const fs = require('fs');
const auth = require('../midlware/auth.midlware')
const path = require('path');
var router = express();
router.use(formidableMiddleware());


router.post(
    '/isadmin',
    auth,
    async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Немає авторизації' })
            }
            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const check_user = decoded;

            const user = await User.findOne({ where: { UserId: check_user.userId } });

            if (user.Status == "admin") {
                res.status(201).json({ message: 'Перевірку пройдено' });
            }
            else {
                res.status(500).json({ message: 'Недостатньо прав користувача' });
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Недостатньо прав користувача' });
        }
    }
)

router.get(
    '/getusers',
    auth,
    async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Немає авторизації' })
            }
            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const check_user = decoded;

            const user = await User.findOne({ where: { UserId: check_user.userId } });

            if (user.Status == "admin") {

                const users = await User.findAll({
                    attributes: ['UserId', 'name', 'surname', 'email', 'Status', 'createdAt', 'age', 'gender', 'updatedAt'],
                    where: { Status: "user" },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });

                res.status(201).json({ message: 'Користувачів отримано', users: users });
            }
            else {
                res.status(500).json({ message: 'Недостатньо прав користувача' });
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Помилка при отриманні користувачів' });
        }
    }
)

router.post(
    '/deleteuser',
    auth,
    async (req, res) => {
        try {
            const { UserId } = req.fields;
            const uploadFolder = path.join(__dirname, "../upload_avatar");
            const uploadFolderPet = path.join(__dirname, "../upload");
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Немає авторизації' })
            }
            const decoded = jwt.verify(token, config.get('jwtSecret'))
            const check_user = decoded;

            const useradmin = await User.findOne({ where: { UserId: check_user.userId } });

            if (useradmin.Status == "admin") {
                const user = await User.findOne({ where: { UserId: UserId } });
                if (user) {
                    await Comment.destroy({
                        where: {
                            UserUserId: user.UserId
                        }
                    });
                    const pet = await Pet.findAll({ where: { UserUserId: user.UserId } });
                    for (let i in pet) {
                        const petphotos = await Photo_avatar.findAll({ where: { PetPetId: pet[i].PetId } });
                        for (let i in petphotos) {
                            fs.unlink(path.join(uploadFolderPet, petphotos[i].FileName), (err) => { if (err) throw err; });

                        }
                        await Photo_avatar.destroy({ where: { PetPetId: pet[i].PetId } });
                    }
                    await Pet.destroy({ where: { UserUserId: user.UserId } });

                    const ad = await Ad.findAll({ where: { UserUser: UserId } });
                    await Comment.destroy({
                        where: {
                            AdAdId: ad.AdId
                        }
                    });
                    await Ad.destroy({where: {UserUserId: user.UserId}});

                    const avatar = await Photo_avatar.findAll({where: {UserUserId: user.UserId}});
                    for(let i in avatar){
                        fs.unlink(path.join(uploadFolder, avatar[i].FileName), (err) => { if (err) throw err; });
                    }
                    await Photo_avatar.destroy({where: {UserUserId: user.UserId}});

                    await User.destroy({where: {UserId: user.UserId}});
                    res.status(201).json({ message: 'Користувачів видалено' });
                }
            }
            else {
                res.status(500).json({ message: 'Недостатньо прав користувача' });
            }
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Помилка при видаленні користувача' });
        }
    }
)

module.exports = router