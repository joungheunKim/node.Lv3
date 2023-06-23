'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId'
      });
      this.belongsTo(models.Posts, {
        targetKey: 'postId',
        foreignKey: 'PostId'
      })
    }
  }
  Comments.init({
    commentId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    PostId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commenter: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};