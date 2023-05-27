const express = require('express');
const { check, validationResult } = require('express-validator');
const formidableMiddleware = require('express-formidable');
const jwt = require('jsonwebtoken')
const jwtconfig = require('config')
const nodemailer = require('nodemailer')
const Ad = require('../models/ad')
const User = require('../models/user');
const Comment = require('../models/comment');
const Photo_avatar = require('../models/photo_avatar');
const config = require('../config/email.json');
const auth = require('../midlware/auth.midlware');

var app = express();
app.use(formidableMiddleware());

app.post(
    '/create',
    auth,
    async (req, res) => {
        try {
            const { comment, UserId, AdId } = req.fields;
            const candidate = await User.findOne({ where: { UserId: UserId } });
            const ad = await Ad.findOne({ where: { AdId: AdId } });
            if (candidate != null) {
                if (ad != null) {
                    if (comment != "") {
                        await Comment.create({
                            UserUserId: UserId,
                            AdAdId: AdId,
                            text: comment
                        }
                        );
                    }
                }
            }
            res.status(201).json({ message: 'Коментар створено'});
        }
        
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Не вдалося створити коментар' })
        }
    }
)

app.post(
    '/getcomments',
    async (req, res) => {
        try {
            const { AdId } = req.fields;
            // const ad = await Ad.findAll({ where: { AdId: AdId } });
            const comments = await Comment.findAll({
                attributes: ['CommentId', 'text', 'UserUserId'],
                include: {
                    model: User,
                    attributes: ['UserId', 'name'],
                    include: {
                        model: Photo_avatar,
                        attributes: ['ImagePath']
                    }
                },
                where: { AdAdId: AdId },
                order: [['createdAt', 'ASC']]
            });
            console.log(comments);
            res.status(201).json({ message: 'Коментарі отримано', comments: comments });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Не вдалося створити коментар' })
        }
    }
)

app.post(
    '/delete',
    auth,
    async (req, res) =>{
        try{
            const {CommentId, UserId} = req.fields;
            console.log(CommentId, UserId);
            const token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ message: 'Немає авторизації' })
                }

                const decoded = jwt.verify(token, jwtconfig.get('jwtSecret'))
                const check_user = decoded;
                if (check_user.userId != UserId) {
                    return res.status(401).json({ message: 'Спроба шахрайства' });
                }
                const user = await User.findOne({ where: { UserId: check_user.userId } });
                const comment = await Comment.findOne({where: {CommentId: CommentId}});
                console.log(comment.text);
                console.log(comment.UserUserId);
                if (user && comment) {
                    console.log("&&")
                    console.log(user.UserId, comment.UserUserId);
                    if(user.UserId == comment.UserUserId || user.Status == "admin"){
                        console.log("if2");
                        await Comment.destroy({where: {
                            CommentId: comment.CommentId
                        }}).then(console.log("then"));
                    }
                }
                else{
                    console.log("else");
                }
                res.status(201).json({ message: 'Коментар видалено'})
        }
        catch(e){
            console.log(e);
            res.status(500).json({ message: 'Не вдалося видалити коментар' })
        }
    }
)

module.exports = app;