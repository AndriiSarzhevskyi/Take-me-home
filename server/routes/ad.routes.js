const express = require('express');
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator');
const auth = require('../midlware/auth.midlware');
const { IncomingForm } = require('formidable');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const User = require('../models/user');
const Pet = require('../models/pet');
const Ad = require('../models/ad');
const Ukraine = require('../models/Ukraine');
const Photo_avatar = require('../models/photo_avatar');
const Pet_category = require('../models/pet_category');
const Comment = require('../models/comment');
const nodemailer = require('nodemailer')
const configemail = require('../config/email.json');

var app = express();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(express.static(`${__dirname}/files`));

const isFileValid = (file) => {
    if (file.length) {
        for (let i = 0; i < file.length; i++) {
            const type = file[i].type.split("/").pop();
            const validTypes = ["jpg", "jpeg", "png", "gif"];
            if (validTypes.indexOf(type) === -1) {
                return false;
            }
        }
    }
    else {
        const type = file.type.split("/").pop();
        const validTypes = ["jpg", "jpeg", "png", "gif"];
        if (validTypes.indexOf(type) === -1) {
            return false;
        }
    }
    return true;
};

app.post(
    '/create',
    auth,
    [
        check('chipnumber', 'Номер чіпу складається лише з цифр, довжина номеру 15 символів')
            .isLength({ min: 8 }).matches(/^[0-9]+$/)
    ],
    async (req, res) => {

        try {
            const form = new IncomingForm();
            // const uploadFolder = path.join(__dirname, "../files", "pets");
            const uploadFolder = path.join(__dirname, "../upload");
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

                if (files.photo.length) {

                    const isValid = isFileValid(file);
                    if (!isValid) {
                        return res.status(400).json({
                            message: "The file type is not a valid type"
                        });
                    }
                }

                const { Id, name, chipnumber, color, gender, date, about, city, adtype, petcategory } = fields;
                let status;
                let res_status;
                if (adtype == "lost") {
                    status = "Не знайдено";
                }
                if (adtype == "found") {
                    status = "Володаря не знайдено";
                }
                const errors = validationResult(fields)
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Некоректні дані при створенні оголошення'
                    })
                }
                let res_ad_id = null;
                const res_pet = await Pet.findOne({ where: { chipnumber: chipnumber } });

                // for (let i in candidatepet) {
                //     const res_ad = await Ad.findAll({ where: { PetPetId: candidatepet[i].PetId } });
                // for (let i in res_ad) {
                if (res_pet) {
                    if (res_pet.PetId != null) {
                        const petcat = await Pet_category.findOne({ where: { category: petcategory } });
                        if (res_pet.PetCategoryCategoryId == petcat.CategoryId) {
                            const res_ad = await Ad.findOne({ where: { PetPetId: res_pet.PetId } });
                            if (res_ad.AdId != null) {
                                if (res_ad.ResultAdId == null) {
                                    if (res_ad.type != adtype) {
                                        if (adtype == "lost") {
                                            status = "Повернено додому";
                                        }
                                        if (adtype == "found") {
                                            status = "Знайдено";
                                        }
                                        if (res_ad.type == "lost") {
                                            res_status = "Знайдено";
                                        }
                                        if (res_ad.type == "found") {
                                            res_status = "Володаря знайдено";
                                        }
                                        res_ad_id = res_ad.AdId;
                                        const usermail = await User.findOne({ where: { UserId: res_ad.UserUserId } });
                                        const transporter = nodemailer.createTransport({
                                            host: configemail.host,
                                            port: configemail.port,
                                            auth: {
                                                user: configemail.user_email,
                                                pass: configemail.password
                                            }
                                        });
                                        let code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                                        codemail = code;
                                        const mailOptions = {
                                            from: configemail.user_email,
                                            to: usermail.email,
                                            subject: 'Take me home',
                                            text: "Здається вашого улюбленця знайдено. З'явилося нове оголошення про тварину з таким самим номером чіпу, обов'язково зв'яжіться з його власником. Статус оголошення автоматично змінено. Детальну інформацію ви можете переглянути в особистому кабінеті."
                                        };
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                            } else {
                                            }
                                        });
                                    }
                                }
                                else if (res_ad.ResultAdId != null) {
                                    return res.status(400).json({ errors: errors.array(), message: 'Це оголошення вже виконано' })
                                }
                                else {
                                    return res.status(400).json({ errors: errors.array(), message: 'Аналогічне оголошення про цю тварину вже існує' })
                                }
                            }
                        }
                    }
                }
                //     }
                // }
                const user = await User.findOne({ where: { UserId: Id } });
                if (user == null) {
                    return res.status(400).json({ errors: errors.array(), message: 'Помилка користувач не існує' })
                }
                else {
                    const category = await Pet_category.findOne({ where: { category: petcategory } });
                    Pet.create({
                        name: name,
                        gender: gender,
                        color: color,
                        chipnumber: chipnumber,
                        UserUserId: user.UserId,
                        PetCategoryCategoryId: category.CategoryId

                    }).then((pet) => {
                        let fileName, newfileName, newpath;
                        if (file.length) {
                            for (let i = 0; i < file.length; i++) {

                                fileName = encodeURIComponent(file[i].name.replace(/\s/g, "-"));
                                newfileName = pet.PetId + fileName;
                                newpath = path.join(uploadFolder, newfileName);

                                fs.renameSync(file[i].path, newpath);
                                newpath = "/upload/" + newfileName;
                                Photo_avatar.create({
                                    FileName: newfileName,
                                    Title: pet.name + ".avatar",
                                    ImagePath: newpath,
                                    ImageData: newpath,
                                    PetPetId: pet.PetId
                                });
                            }
                        }
                        else {
                            fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));
                            newfileName = pet.PetId + fileName;
                            newpath = path.join(uploadFolder, newfileName);
                            fs.renameSync(file.path, newpath);
                            newpath = "/upload/" + newfileName;
                            Photo_avatar.create({
                                FileName: newfileName,
                                Title: pet.name + ".avatar",
                                ImagePath: newpath,
                                ImageData: newpath,
                                PetPetId: pet.PetId
                            });
                        }
                        Ad.create({
                            About: about,
                            Date: date,
                            type: adtype,
                            status: status,
                            UkraineId: parseInt(city),
                            UserUserId: parseInt(Id),
                            PetPetId: parseInt(pet.PetId)
                        }).then((ad) => {
                            if (res_ad_id != null) {
                                Ad.update(
                                    { ResultAdId: res_ad_id },
                                    { where: { AdId: ad.AdId } }
                                );
                                Ad.update(
                                    { ResultAdId: ad.AdId, status: res_status },
                                    { where: { AdId: res_ad_id } }
                                );

                            }
                        });
                    });
                }
                res.status(201).json({ message: 'Оголошення створено' })
            });
        } catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
        }
    });

app.post(
    '/getads',
    async (req, res) => {
        try {
            console.log("asdsd")
            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "There was an error parsing the files",
                        error: err,
                    });
                }
                const { type } = fields;
                const ads = await Ad.findAll({
                    attributes: ['AdId', 'status', 'Date', 'About', 'type'],
                    include: [
                        {

                            model: Ukraine,
                            attributes: ['Id', 'name_uk']

                        },

                        {
                            model: Pet,
                            attributes: ['PetId', 'name', 'gender'],
                            include: [
                                {
                                    model: Photo_avatar,
                                    attributes: ['FileName', 'ImagePath']
                                }
                            ]
                        }],
                    where: { type: type },
                    order: [
                        ['Date', 'ASC']
                    ]

                });
                let img = [];

                // const promises = [];
                // for (let i in ads) {
                //     console.log("i= " + i);
                //     for (let j in ads[i].Pet.Photo_avatars) {
                //         console.log("j = " + j);
                //         const imagePath = ads[i].Pet.Photo_avatars[j].ImagePath;
                //         promises.push(
                //             fs.promises.readFile(imagePath)
                //                 .then((data) => {
                //                     ads[i].Pet.Photo_avatars[j].ImagePath = data;
                //                     img.push(data);
                //                     console.log(`Successfully read image data for ${imagePath}`);
                //                 })
                //                 .catch((error) => {
                //                     console.error(`Error reading image data for ${imagePath}:`, error);
                //                     res.status(400).json({ message: 'Фото не знайдено' });
                //                 })
                //         );
                //     }
                // }
                // await Promise.all(promises);

                res.status(201).json({ message: 'Оголошення отримано', data: ads });
            });
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
        }
    }
);

app.post(
    '/getadsfilter',
    [
        check('chipnumber', 'Номер чіпу складається лише з цифр, довжина номеру 15 символів')
            .isLength({ min: 8 }).matches(/^[0-9]+$/)
    ],
    async (req, res) => {
        try {
            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "There was an error parsing the files",
                        error: err,
                    });
                }

                let { chipnumber, name, type, gender, category, date1, date2, sort, stateId, districtId, placeId } = fields;
                console.log(chipnumber, name, type, gender, category, date1, date2, sort, stateId, districtId, placeId);
                console.log("chp " + chipnumber);
                console.log("name " + name);
                console.log("g " + gender);
                console.log("ca t" + category);
                console.log("d1 " + date1);
                console.log("d2 " + date1);
                console.log("sor " + sort);
                console.log("sId " + stateId);
                console.log("dId " + districtId);
                console.log("pId " + placeId);
                if (chipnumber != null) {
                    const errors = validationResult(fields)
                    if (!errors.isEmpty()) {
                        return res.status(400).json({
                            errors: errors.array(),
                            message: 'Некоректні дані при створенні оголошення'
                        })
                    }
                }
                if (date1 == "") {
                    date1 = new Date('1970-01-01');
                }
                if (date2 == "") {
                    date2 = new Date();
                }
                let ads;

                const whereClause = {};

                if (stateId !== undefined) {
                    whereClause['$Ukraine.parent.parent.parent.Id$'] = stateId;
                }

                if (districtId !== undefined) {
                    whereClause['$Ukraine.parent.parent.Id$'] = districtId;
                }

                if (placeId !== undefined) {
                    whereClause['$Ukraine.Id$'] = placeId;
                }

                if (chipnumber !== "") {
                    whereClause['$Pet.chipnumber$'] = chipnumber;
                }

                if (name !== "") {
                    whereClause['$Pet.name$'] = { [Sequelize.Op.startsWith]: name };
                }

                if (category !== "") {
                    whereClause['$Pet.Pet_category.category$'] = category;
                }

                if (gender !== "") {
                    whereClause['$Pet.gender$'] = gender;
                }

                if (districtId != undefined || stateId != undefined) {
                    ads = await Ad.findAll({
                        attributes: ['AdId', 'status', 'Date', 'About', 'type'],
                        include: [
                            {
                                model: Ukraine,
                                attributes: ['Id', 'name_uk'],
                                include: [
                                    {
                                        model: Ukraine,
                                        as: 'parent',
                                        attributes: ['name_uk', 'type'],
                                        where: { type: 'COMMUNITY' },
                                        include: [
                                            {
                                                model: Ukraine,
                                                as: 'parent',
                                                attributes: ['name_uk', 'type'],
                                                where: { type: 'DISTRICT' },
                                                include: [
                                                    {
                                                        model: Ukraine,
                                                        as: 'parent',
                                                        attributes: ['name_uk', 'type']
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                where: {
                                    [Sequelize.Op.or]: [
                                        { type: 'CITY' },
                                        { type: 'URBAN' },
                                        { type: 'SETTLEMENT' },
                                        { type: 'VILLAGE' },
                                        { type: 'CAPITAL_CITY' },

                                    ],
                                }
                            },
                            {
                                model: Pet,
                                attributes: ['PetId', 'name', 'gender'],
                                include: [
                                    {
                                        model: Photo_avatar,
                                        attributes: ['FileName', 'ImagePath'],
                                    },
                                    {
                                        model: Pet_category,
                                        attributes: ['category']
                                    }
                                ]
                            }
                        ],
                        where: {
                            type: type,
                            Date: {
                                [Sequelize.Op.gt]: date1,
                                [Sequelize.Op.lt]: date2,
                            },
                            ...whereClause // добавляем проверки в условие where
                        },
                        order: [
                            ['Date', `${sort}`]
                        ]
                    });
                }
                else {
                    console.log("else");
                    ads = await Ad.findAll({
                        attributes: ['AdId', 'status', 'Date', 'About', 'type'],
                        include: [
                            {
                                model: Ukraine,
                                attributes: ['Id', 'name_uk'],
                            },
                            {
                                model: Pet,
                                attributes: ['PetId', 'name', 'gender'],
                                include: [
                                    {
                                        model: Photo_avatar,
                                        attributes: ['FileName', 'ImagePath'],
                                    },
                                    {
                                        model: Pet_category,
                                        attributes: ['category']
                                    }
                                ]
                            }
                        ],
                        where: {
                            type: type,
                            Date: {
                                [Sequelize.Op.gt]: date1,
                                [Sequelize.Op.lt]: date2,
                            },
                            ...whereClause // добавляем проверки в условие where
                        },
                        order: [
                            ['Date', `${sort}`]
                        ]
                    });
                }
                console.log(ads);
                res.status(201).json({ message: 'Оголошення отримано', data: ads });
            })

        }
        catch (e) { res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' }) }
    }

)

app.get('/getad/:id', async (req, res) => {
    try {
        console.log("here");
        const id = req.params.id;
        const ad = await Ad.findOne({
            attributes: ['AdId', 'status', 'Date', 'About', 'type', 'ResultAdId'],
            include: [
                {

                    model: Ukraine,
                    attributes: ['Id', 'public_name_uk']

                },
                {
                    model: User,
                    attributes: ['UserId', 'name', 'surname', 'email']
                },
                {
                    model: Pet,
                    attributes: ['PetId', 'name', 'gender', 'color', 'chipnumber'],
                    include: [
                        {
                            model: Photo_avatar,
                            attributes: ['FileName', 'ImagePath']
                        },
                        {
                            model: Pet_category,
                            attributes: ['category']
                        }
                    ]
                }],
            where: { AdId: id },
            order: [
                ['Date', 'ASC']
            ]

        });

        // const comments = await Comment.findAll({
        //     attributes: ['CommentId', 'text', 'UserUserId'],
        //     include: {
        //         model: User,
        //         attributes: ['UserId','name'],
        //         include:{
        //             model: Photo_avatar,
        //             attributes: ['ImagePath']
        //         }
        //     },
        //     where: { AdAdId: id },
        //     order: [['createdAt', 'ASC']]
        // });
        // console.log(comments);

        res.status(201).json({ message: 'Оголошення отримано', ad: ad /*, comments: comments */ });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Щось пішло не за планом, спробуйте знову' })
    }
})

app.post(
    '/updatestatus',
    auth,
    async (req, res) => {
        try {

            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "There was an error parsing the files",
                        error: err,
                    });
                }

                const { AdId, status } = fields;

                const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
                if (!token) {
                    return res.status(401).json({ message: 'Немає авторизації' })
                }

                const decoded = jwt.verify(token, config.get('jwtSecret'))
                const check_user = decoded;
                // if (check_user.userId != UserId) {
                //     return res.status(401).json({ message: 'Спроба шахрайства' });
                // }
                const user = await User.findOne({ where: { UserId: check_user.userId } });
                const ad = await Ad.findOne({ where: { AdId: AdId } });
                if (user.Status == "admin" || user.UserId == ad.UserUserId) {
                    await Ad.update(
                        { status: status },
                        { where: { AdId: AdId } }
                    );
                }
            });
            res.status(201).json({ message: 'Статус змынено' });
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не за планом, спробуйте знову' });
        }
    }
)


app.post(
    '/update',
    auth,
    [
        check('chipnumber', 'Номер чіпу складається лише з цифр, довжина номеру 15 символів')
            .isLength({ min: 8 }).matches(/^[0-9]+$/)
    ],
    async (req, res) => {
        try {
            const form = new IncomingForm();
            const uploadFolder = path.join(__dirname, "../upload");
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

                if (files.photo.length) {

                    const isValid = isFileValid(file);
                    if (!isValid) {
                        return res.status(400).json({
                            message: "The file type is not a valid type"
                        });
                    }
                }

                const { AdId, UserId, PetId, name, chipnumber, color, gender, date, about, adtype, petcategory } = fields;
                console.log(AdId, UserId, PetId, name, chipnumber, color, gender, date, about, adtype, petcategory);
                const errors = validationResult(fields)
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Некоректні дані при створенні оголошення'
                    })
                }
                const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
                if (!token) {
                    return res.status(401).json({ message: 'Немає авторизації' })
                }

                const decoded = jwt.verify(token, config.get('jwtSecret'))
                const check_user = decoded;
                if (check_user.userId != UserId) {
                    return res.status(401).json({ message: 'Спроба шахрайства' });
                }
                console.log(check_user);
                const user = await User.findOne({ where: { UserId: UserId } });
                const ad = await Ad.findOne({ where: { AdId: AdId } });
                if (user == null) {
                    return res.status(400).json({ errors: errors.array(), message: 'Помилка користувач не існує' })
                }

                else if (user.Status == "admin" || user.UserId == ad.UserUserId) {

                    const category = await Pet_category.findOne({ where: { category: petcategory } });
                    console.log("cat");
                    const pet = await Pet.update(
                        {
                            name: name,
                            gender: gender,
                            color: color,
                            chipnumber: chipnumber,
                            UserUserId: user.UserId,
                            PetCategoryCategoryId: category.CategoryId
                        },
                        {
                            where: {
                                PetId: PetId
                            }
                        }


                    );

                    console.log("pet");
                    console.log(pet);
                    let fileName, newfileName, newpath;
                    console.log("a");
                    if (file.length > 0) {
                        console.log("if1");
                        const tmp = await Photo_avatar.findAll({ where: { PetPetId: PetId } });
                        console.log("photo-f");
                        for (let i in tmp) {
                            fs.unlink(path.join(uploadFolder, tmp[i].FileName), (err) => { if (err) throw err; });
                        }
                        console.log("unlink");
                        await Photo_avatar.destroy({
                            where: {
                                PetPetId: PetId
                            }
                        }).then(console.log("destroy"));
                        for (let i = 0; i < file.length; i++) {
                            console.log("for");
                            fileName = encodeURIComponent(file[i].name.replace(/\s/g, "-"));
                            newfileName = PetId + fileName;
                            newpath = path.join(uploadFolder, newfileName);

                            fs.renameSync(file[i].path, newpath);
                            newpath = "/upload/" + newfileName;
                            await Photo_avatar.create({
                                FileName: newfileName,
                                Title: name + ".avatar",
                                ImagePath: newpath,
                                ImageData: newpath,
                                PetPetId: PetId
                            });
                        }

                    }
                    else {
                        console.log("else");
                        if (file.size > 0) {
                            console.log("file-size");
                            const tmp = await Photo_avatar.findOne({ where: { PetPetId: PetId } });
                            console.log(tmp);
                            fs.unlink(path.join(uploadFolder, tmp.FileName), (err) => { if (err) throw err; });
                            console.log("unlink");
                            await Photo_avatar.destroy({ where: { PetPetId: PetId } });
                            fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));
                            newfileName = PetId + fileName;
                            newpath = path.join(uploadFolder, newfileName);
                            fs.renameSync(file.path, newpath);
                            console.log("newpath");
                            newpath = "/upload/" + newfileName;
                            await Photo_avatar.create({
                                FileName: newfileName,
                                Title: name + ".avatar",
                                ImagePath: newpath,
                                ImageData: newpath,
                                PetPetId: PetId
                            });
                        }
                    }
                    await Ad.update(
                        {
                            About: about,
                            Date: date,
                            type: adtype,
                        },
                        {
                            where: {
                                AdId: AdId
                            }
                        }
                    )
                    // .then((ad) => {
                    //     if (res_ad_id != null) {
                    //         Ad.update(
                    //             { ResultAdId: res_ad_id },
                    //             { where: { AdId: ad.AdId } }
                    //         );
                    //         Ad.update(
                    //             { ResultAdId: ad.AdId },
                    //             { where: { AdId: res_ad_id } }
                    //         );
                    //     }
                    // });

                }
                res.status(201).json({ message: 'Оголошення оновлено' })
            });
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не за планом, спробуйте знову' });
        }
    }
)

app.post(
    '/delete',
    auth,
    async (req, res) => {
        try {
            const form = new IncomingForm();
            const uploadFolder = path.join(__dirname, "../upload");
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

                const { UserId, AdId } = fields;

                const token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ message: 'Немає авторизації' })
                }

                const decoded = jwt.verify(token, config.get('jwtSecret'))
                const check_user = decoded;
                if (check_user.userId != UserId) {
                    return res.status(401).json({ message: 'Спроба шахрайства' });
                }

                const ad = await Ad.findOne({ where: { AdId: AdId } });
                const candidate = await User.findOne({ where: { UserId: check_user.userId } });
                if (candidate.Status == "admin" || ad.UserUserId == candidate.UserId) {
                    if (ad) {
                        const pet = await Pet.findOne({ where: { PetId: ad.PetPetId } });
                        if (pet) {
                            const photos = await Photo_avatar.findAll({ where: { PetPetId: pet.PetId } });
                            for (let i in photos) {
                                fs.unlink(path.join(uploadFolder, photos[i].FileName), (err) => { if (err) throw err; });
                            }
                            await Photo_avatar.destroy({
                                where: {
                                    PetPetId: pet.PetId
                                }
                            });
                            await Pet.destroy({
                                where: {
                                    PetId: pet.PetId
                                }
                            });
                            await Comment.destroy({
                                where: {
                                    AdAdId: ad.AdId
                                }
                            });
                            await Ad.destroy({
                                where: {
                                    AdId: ad.AdId
                                }
                            });
                        }
                    }
                    res.status(201).json({ message: 'Оголошення видалено' })
                }
                else {
                    res.status(500).json({ message: 'Недостатньо прав' });
                }

            });

        }

        catch (e) {
            res.status(500).json({ message: 'Не вдалося видалити оголошення' });
        }
    }
)

app.post(
    '/getuserads',
    auth,
    async (req, res) => {
        try {
            console.log("asdsd")
            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "There was an error parsing the files",
                        error: err,
                    });
                }

                const { UserId } = fields;
                // const token = req.headers.authorization.split(' ')[1];
                // if (!token) {
                //     return res.status(401).json({ message: 'Немає авторизації' })
                // }

                // const decoded = jwt.verify(token, config.get('jwtSecret'))
                // const check_user = decoded;
                // if (check_user.userId != UserId) {
                //     return res.status(401).json({ message: 'Спроба шахрайства' });
                // }
                const user = await User.findOne({ where: { UserId: UserId } });
                if (user) {
                    const whereClause = {};

                    if (UserId !== undefined) {
                        whereClause['$User.UserId$'] = UserId;
                    }
                    const ads = await Ad.findAll({
                        // attributes: ['UserId'],
                        // include: [{
                        //     model: Ad,
                        attributes: ['AdId', 'status', 'Date', 'About', 'type', 'createdAt'],
                        include: [
                            {

                                model: Ukraine,
                                attributes: ['Id', 'name_uk']

                            },
                            {
                                model: User,
                                attributes: ['UserId']
                            },
                            {
                                model: Pet,
                                attributes: ['PetId', 'name', 'gender'],
                                include: [
                                    {
                                        model: Photo_avatar,
                                        attributes: ['FileName', 'ImagePath']
                                    }
                                ]
                            }],
                        where: {
                            ...whereClause
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
                        // }],
                        // where: {
                        //     UserId: UserId
                        // }
                    });
                    res.status(201).json({ message: 'Оголошення отримано', data: ads });
                }

            });
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
        }
    }
);

app.post(
    '/getusercomments',
    auth,
    async (req, res) => {
        try {
            const form = new IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: "Fail",
                        message: "There was an error parsing the files",
                        error: err,
                    });
                }

                const { UserId } = fields;
                // const token = req.headers.authorization.split(' ')[1];
                // if (!token) {
                //     return res.status(401).json({ message: 'Немає авторизації' })
                // }

                // const decoded = jwt.verify(token, config.get('jwtSecret'))
                // const check_user = decoded;
                // if (check_user.userId != UserId) {
                //     return res.status(401).json({ message: 'Спроба шахрайства' });
                // }
                const user = await User.findOne({ where: { UserId: UserId } });
                if (user) {
                    const ads = await Ad.findAll({
                        attributes: ['AdId', 'status', 'Date', 'About', 'type', 'createdAt'],
                        include: [
                            {

                                model: Ukraine,
                                attributes: ['Id', 'name_uk']

                            },
                            {
                                model: Pet,
                                attributes: ['PetId', 'name', 'gender'],
                                include: [
                                    {
                                        model: Photo_avatar,
                                        attributes: ['FileName', 'ImagePath']
                                    }
                                ]
                            },
                            {
                                model: Comment,
                                attributes: ['CommentId', 'UserUserId'],
                                where: {
                                    UserUserId: UserId
                                }
                            }
                        ],
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    });
                    res.status(201).json({ message: 'Оголошення отримано', data: ads });
                }

            });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
        }
    }
);

module.exports = app;