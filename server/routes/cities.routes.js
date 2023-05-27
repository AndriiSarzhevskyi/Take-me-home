const express = require('express');
const Sequelize = require('sequelize')
const { check, validationResult } = require('express-validator');
const formidableMiddleware = require('express-formidable');
const config = require('../config/email.json');
const Ukraine = require('../models/Ukraine');
const { where, or } = require('sequelize');


var app = express();
app.use(formidableMiddleware());


app.post(
    '/getcitiesbyname',
    async (req, res) => {
        const { search } = req.fields;
        try {
            const result = await Ukraine.findAll({
                attributes: ['Id', 'public_name_uk', 'parent_id'],
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
                                        where: { type: 'STATE' },
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

                    ],
                    name_uk: {
                        [Sequelize.Op.startsWith]: search
                    }
                },
                order: [
                    ['name_uk', 'ASC'] // сортировка по возрастанию имени
                ],
                limit: 100
            })

            const capital = await Ukraine.findAll({
                attributes: ['Id', 'name_uk', 'parent_id'],
                where: {
                    type: 'CAPITAL_CITY',
                    name_uk: {
                        [Sequelize.Op.startsWith]: search
                    }
                },
            });

            let cities_arr = [];
            for (let i in capital) {
                let tmp_arr = [];
                tmp_arr.push(capital[i].Id);
                tmp_arr.push(capital[i].name_uk);
                cities_arr.push(tmp_arr);
            }

            for (let i in result) {
                let tmp_arr = [];
                tmp_arr.push(result[i].Id);
                if (result[i].parent.parent.parent.name_uk == 'Автономна Республіка Крим') {
                    tmp_arr.push(result[i].public_name_uk + " " + result[i].parent.parent.parent.name_uk);

                }
                else {
                    tmp_arr.push(result[i].public_name_uk + " " + result[i].parent.parent.name_uk + " рн." + " " + result[i].parent.parent.parent.name_uk + " обл.");
                }
                cities_arr.push(tmp_arr);
            } 

            res.status(201).json({ message: 'Успіх', cities: cities_arr })
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
        }
    });

app.post(
    '/getstate',
    async (req, res) => {
        const { search } = req.fields;
        try {
            const result = await Ukraine.findAll({
                attributes: ['Id', 'name_uk'],
                where: {
                    type: 'STATE',
                    name_uk: {
                        [Sequelize.Op.startsWith]: search
                    }
                },
                order: [
                    ['name_uk', 'ASC'] // сортировка по возрастанию имени
                ],
                limit: 20
            })

            let cities_arr = [];

            for (let i in result) {
                let tmp_arr = [];
                tmp_arr.push(result[i].Id);

                tmp_arr.push(result[i].name_uk);

                cities_arr.push(tmp_arr);
            }

            res.status(201).json({ message: 'Успіх', cities: cities_arr })
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
        }
    });


app.post(
    '/getdistrict',
    async (req, res) => {
        const { search, stateId } = req.fields;
        try {
            console.log("district");
            let result;
            if (stateId == undefined) {
                result = await Ukraine.findAll({
                    attributes: ['Id', 'name_uk'],
                    where: {
                        type: 'DISTRICT',
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                })
            }
            else {
                result = await Ukraine.findAll({
                    attributes: ['Id', 'name_uk', 'parent_id'],
                    include: {
                        model: Ukraine,
                        as: 'parent',
                        where: {
                            type: 'STATE',
                            Id: stateId
                        },
                        attributes: ['name_uk', 'type']
                    },
                    where: {
                        type: 'DISTRICT',
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                });
            }
            let cities_arr = [];

            for (let i in result) {
                let tmp_arr = [];
                tmp_arr.push(result[i].Id);
                tmp_arr.push(result[i].name_uk);
                cities_arr.push(tmp_arr);
            }

            res.status(201).json({ message: 'Успіх', cities: cities_arr })
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
        }
    });

app.post(
    '/getcity',
    async (req, res) => {
        const { search, stateId, districtId } = req.fields;
        console.log(stateId, districtId);
        try {
            let result;
            if (stateId == undefined && districtId == undefined) {
                console.log("stateId == undefined && districtId ==  undefined");
                result = await Ukraine.findAll({
                    attributes: ['Id', 'public_name_uk', 'name_uk', 'type'],
                    include: [
                        {
                            model: Ukraine,
                            as: 'parent',
                            attributes: ['public_name_uk', 'name_uk', 'type'],
                            where: { type: 'COMMUNITY' },
                            include: [
                                {
                                    model: Ukraine,
                                    as: 'parent',
                                    attributes: ['public_name_uk', 'name_uk', 'type'],
                                    where: { type: 'DISTRICT' },
                                    include: [
                                        {
                                            model: Ukraine,
                                            as: 'parent',
                                            attributes: ['public_name_uk', 'name_uk', 'type'],
                                            where: { type: 'STATE' },

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
                        ],
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                })
            }
            else if (stateId != undefined && districtId == undefined) {
                console.log("else if 1");
                result = await Ukraine.findAll({
                    attributes: ['Id', 'public_name_uk', 'name_uk', 'parent_id', 'type'],
                    include: [
                        {
                            model: Ukraine,
                            as: 'parent',
                            attributes: ['public_name_uk', 'name_uk', 'public_name_uk', 'type'],
                            where: { type: 'COMMUNITY' },
                            include: [
                                {
                                    model: Ukraine,
                                    as: 'parent',
                                    attributes: ['public_name_uk', 'name_uk', 'public_name_uk', 'type'],
                                    where: { type: 'DISTRICT' },
                                    include: [
                                        {
                                            model: Ukraine,
                                            as: 'parent',
                                            attributes: ['public_name_uk', 'name_uk', 'public_name_uk', 'type'],
                                            where: {
                                                type: 'STATE',
                                                Id: stateId
                                            }
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
                        ],
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                });
            }
            else if (stateId == undefined && districtId != undefined) {
                result = await Ukraine.findAll({
                    attributes: ['Id', 'public_name_uk', 'name_uk', 'parent_id'],
                    include: [
                        {
                            model: Ukraine,
                            as: 'parent',
                            attributes: ['public_name_uk', 'name_uk', 'type'],
                            where: { type: 'COMMUNITY' },
                            include: [
                                {
                                    model: Ukraine,
                                    as: 'parent',
                                    attributes: ['public_name_uk', 'name_uk', 'type'],
                                    where: {
                                        type: 'DISTRICT',
                                        Id: districtId
                                    },
                                    include: [
                                        {
                                            model: Ukraine,
                                            as: 'parent',
                                            attributes: ['public_name_uk', 'name_uk', 'type'],
                                            where: {
                                                type: 'STATE',
                                            },
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
                        ],
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                });
            }
            else if (stateId != undefined && districtId != undefined) {
                console.log("else if 2");
                result = await Ukraine.findAll({
                    attributes: ['Id', 'public_name_uk', 'name_uk', 'parent_id'],
                    include: [
                        {
                            model: Ukraine,
                            as: 'parent',
                            attributes: ['public_name_uk', 'name_uk', 'type'],
                            where: { type: 'COMMUNITY' },
                            include: [
                                {
                                    model: Ukraine,
                                    as: 'parent',
                                    attributes: ['public_name_uk', 'name_uk', 'type'],
                                    where: {
                                        type: 'DISTRICT',
                                        Id: districtId
                                    },
                                    include: [
                                        {
                                            model: Ukraine,
                                            as: 'parent',
                                            attributes: ['public_name_uk', 'name_uk', 'type'],
                                            where: {
                                                type: 'STATE',
                                                Id: stateId
                                            },
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
                        ],
                        name_uk: {
                            [Sequelize.Op.startsWith]: search
                        }
                    },
                    order: [
                        ['name_uk', 'ASC'] // сортировка по возрастанию имени
                    ],
                    limit: 20
                });
            }
            let cities_arr = [];

            const capital = await Ukraine.findAll({
                attributes: ['Id', 'public_name_uk', 'parent_id'],
                where: {
                    type: 'CAPITAL_CITY',
                    name_uk: {
                        [Sequelize.Op.startsWith]: search
                    }
                },
            });


            for (let i in capital) {
                let tmp_arr = [];
                tmp_arr.push(capital[i].Id);
                tmp_arr.push(capital[i].public_name_uk);
                cities_arr.push(tmp_arr);
            }

            for (let i in result) {
                let tmp_arr = [];
                tmp_arr.push(result[i].Id);
                tmp_arr.push(result[i].public_name_uk + " " + result[i].parent.parent.name_uk + " рн." + " " + result[i].parent.parent.parent.name_uk + " обл.");;
                cities_arr.push(tmp_arr);
            }
            console.log(cities_arr);
            res.status(201).json({ message: 'Успіх', cities: cities_arr })
        }
        catch (e) {
            res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
        }
    });

module.exports = app;