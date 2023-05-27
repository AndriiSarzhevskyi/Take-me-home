const express = require('express')
process.env.NODE_OPTIONS = '--max-old-space-size=2048';
const config = require('config')
const { Sequelize } = require('sequelize');
const sequelize = require('../server/initDB');
const path = require('path');
// const Ukraine = require("./models/Ukraine")
const app = express();
const PORT = config.get('port');
app.use(express.json({ extended: true }));
app.use('/upload', express.static('upload'));
app.use('/upload_avatar', express.static('upload_avatar'));
// const uploadsPath = path.join(__dirname, '..', 'uploads'); // абсолютный путь к папке uploads

// app.use('/uploads', express.static(uploadsPath));
// app.use(express.static('files'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/email', require('./routes/email.routes'));
app.use('/api/entrance', require('./routes/entrance.routes'));
app.use('/api/jwt', require('./routes/jwt.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/cities', require('./routes/cities.routes'));
app.use('/api/ad', require('./routes/ad.routes'));
app.use('/api/comments', require('./routes/comments.routes'));

// app.get('*', async (req, res) => {
//     try {
//         res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     }
//     catch(e){
        
//     }
//   });

const Ad = require('./models/ad');
const User = require('./models/user');
const Pet = require('./models/pet');
const Pet_category = require('./models/pet_category');
const Photo_avatar = require('./models/photo_avatar');
const Comment = require('./models/comment');
const Ukraine = require('./models/Ukraine');


User.hasOne(Photo_avatar, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Photo_avatar.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Pet);
// Pet.belongsTo(User);
// Pet.hasOne(User);
// User.belongsTo(Pet,{ onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Pet.hasMany(Photo_avatar, { onDelete: "cascade" });
Photo_avatar.belongsTo(Pet, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Comment);
Comment.belongsTo(User);
// Comment.belongsTo(User);
// Comment.hasOne(User , { onDelete: "NO ACTION" });
// User.belongsTo(Comment);
Pet_category.hasMany(Pet, { onDelete: "cascade" });
Pet.belongsTo(Pet_category, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Ad.hasMany(Comment, { onDelete: "cascade" });
Comment.belongsTo(Ad);
Pet.hasOne(Ad);
Ad.belongsTo(Pet);
// Ad.hasOne(Pet, { onDelete: "cascade" });
// Pet.belongsTo(Ad, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Ukraine.hasMany(Ad, { onDelete: "cascade" });
Ad.belongsTo(Ukraine, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Ad);
Ad.belongsTo(User);
async function start() {
    try {

        // await sequelize.authenticate();
        // console.log('Connection has been established successfully.');
        // await  Ad.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        // await  Pet.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        // await  User.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        // await  Pet_category.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        // await  Photo_avatar.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        // await  Comment.sync({ force: true }).then(result=>{
        // })
        // .catch(err=> console.log(err));
        await sequelize.sync({ alter: true }).then(result => {
        })
            .catch(err => console.log(err));
        app.listen(PORT, () => console.log(`App started on port: ${PORT}...`));
    } catch (e) {
        console.log("Server ERROR", e.message);
        process.exit(1);
    }
}

start()
