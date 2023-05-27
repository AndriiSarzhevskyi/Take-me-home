const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../initDB');
class Comment extends Model { }

Comment.init({
    CommentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    modelName: 'Comment'
}
);


// Pet.hasOne(User);
module.exports = Comment;
