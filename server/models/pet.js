const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB');
const User = require('../models/user')
const Ad = require('../models/ad')
const Photo_avatar = require('../models/photo_avatar')
class Pet extends Model {}

Pet.init({
    PetId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chipnumber: {
        type: DataTypes.STRING(15),
        allowNull: true
    }, 
    UserUserId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
}, {
    sequelize,
    modelName: 'Pet'
  }
);

// Pet.hasMany(Photo_avatar);
// Pet.hasOne(Ad);
// Pet.hasOne(User);
module.exports = Pet;
