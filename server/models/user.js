const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB')
const Ad = require('../models/ad.js')
const Photo_avatar = require('../models/photo_avatar')
const Pet = require('../models/pet');
const Comment = require('../models/comment')
class User extends Model {}

User.init({
    UserId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}   , {
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

// User.hasMany(Ad);
// User.hasOne(Photo_avatar);
// User.hasOne(Pet);
// User.hasMany(Comment);
module.exports = User;
// User.create({
//     Name: "Asas",
//     Surname: "Bbb",
//     email: "asdds",
//     password: "asdasda",
//     age: 20,
//     status: "saas"
//   }).then(res=>{
//     console.log("Here:" + res);
//   }).catch(err=>console.log(err));

// the defined model is the class itself
//console.log(User === sequelize.models.User); // true