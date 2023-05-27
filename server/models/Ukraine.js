const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB')
const Ad = require('../models/ad')
class Ukraine extends Model {}

Ukraine.init({
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    uuid:{
    type: DataTypes.STRING,
    allowNull: true
    },
    osm_id:{
        type: DataTypes.STRING,
        allowNull: true
    },
    google_maps_place_id:{
        type: DataTypes.STRING,
        allowNull: true
    },
    type:{
        type: DataTypes.STRING,
        allowNull: true
    },
    name_en:{
        type: DataTypes.STRING,
        allowNull: true
    },
    name_ru:{
        type: DataTypes.STRING,
        allowNull: true
    },
    name_uk:{
        type: DataTypes.STRING,
        allowNull: true
    },
    public_name_en:{
        type: DataTypes.STRING,
        allowNull: true
    },
    public_name_ru:{
        type: DataTypes.STRING,
        allowNull: true
    },
    public_name_uk:{
        type: DataTypes.STRING,
        allowNull: true
    },
    post_code:{
        type: DataTypes.TEXT('medium'),
        allowNull: true
    },
    katottg:{
        type: DataTypes.STRING,
        allowNull: true
    },
    koatuu:{
        type: DataTypes.STRING,
        allowNull: true
    },
    lng:{
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    lat:{
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    parent_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }


}   , {
  sequelize, // We need to pass the connection instance
  modelName: 'Ukraine' // We need to choose the model name
});
Ukraine.belongsTo(Ukraine, {as: 'parent', foreignKey: 'parent_id'});
module.exports = Ukraine;

// console.log(ukr['mas'].length);
// for(let i = 0; i < ukr['mas'].length; i++){
//     Ukraine.create({
//         Id: ukr['mas'][i]['id'],
//         uuid: ukr['mas'][i]['uuid'],
//         osm_id: ukr['mas'][i]['meta']['osm_id'],
//         google_maps_place_id: ukr['mas'][i]['meta']['google_maps_place_id'],
//         type: ukr['mas'][i]['type'],
//         name_en: ukr['mas'][i]['name']['en'],
//         name_ru: ukr['mas'][i]['name']['ru'],
//         name_uk: ukr['mas'][i]['name']['uk'],
//         public_name_en: ukr['mas'][i]['public_name']['en'],
//         public_name_ru: ukr['mas'][i]['public_name']['ru'],
//         public_name_uk: ukr['mas'][i]['public_name']['uk'],
//         post_code: JSON.stringify(ukr['mas'][i]['post_code']),
//         katottg: ukr['mas'][i]['katottg'],
//         koatuu: ukr['mas'][i]['koatuu'],
//         lng: ukr['mas'][i]['lng'],
//         lat: ukr['mas'][i]['lat'],
//         parent_id: ukr['mas'][i]['parent_id']
//     });
// }