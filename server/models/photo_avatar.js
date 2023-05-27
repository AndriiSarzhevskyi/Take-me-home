const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB');
const User = require('../models/user')
class Photo_avatar extends Model {}

Photo_avatar.init({
    PhotoId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    FileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ImagePath:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ImageData: {
        type: DataTypes.STRING,
        allowNull: false
    }
}   , {
  sequelize, // We need to pass the connection instance
  modelName: 'Photo_avatar' // We need to choose the model name
});

module.exports = Photo_avatar;