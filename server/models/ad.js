const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB');
const Pet = require('../models/pet');
const Ukraine = require('../models/Ukraine');
const Comment = require('../models/comment')
class Ad extends Model { }

Ad.init({
  AdId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  About: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ResultAdId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'Ad' // We need to choose the model name
});

// Ad.hasOne(Ukraine);
// Ad.hasOne(Pet, { onDelete: "cascade"});
// Ad.hasMany(Comment);
module.exports = Ad;