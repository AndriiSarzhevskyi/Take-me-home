const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB');
const Pet = require('../models/pet');
class Pet_category extends Model {}

Pet_category.init({
    CategoryId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Pet_category'
  }
);

// Pet_category.hasMany(Pet);
module.exports = Pet_category;
