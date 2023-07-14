'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Subscription, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Image, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Properties, {
        foreignKey: 'user_id',
        as:'properties',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    first_name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    last_name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    image:{
      type: DataTypes.STRING,
      defaultValue: ''
    },
    file_name:{
      type:DataTypes.STRING,
      defaultValue:''
    },
    email:{
      type: DataTypes.STRING,
      defaultValue: ''
    },
    password:{
      type: DataTypes.STRING,
      defaultValue: ''
    },
    account_type: DataTypes.INTEGER, //0-->Landlord , 1-->Teanant
    authentication_type: DataTypes.INTEGER, //0->Email, 1->Google, 2->Facebook, 3->Apple
    block:{
      type: DataTypes.INTEGER,                     //0--> unblock 1-->block
      defaultValue:0
    },
    social_id:{
      type: DataTypes.STRING,
      defaultValue: ''
    },
    phone_number: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    address:{
      type: DataTypes.STRING,
      defaultValue: ''
    },
    subscription_active:{
      type: DataTypes.INTEGER,
      defaultValue:0
      
    },
    createdAt: {
      type: DataTypes.BIGINT,

      allowNull: false
    },
    updatedAt: {
      type: DataTypes.BIGINT,
     
      allowNull: false
    },
    
   
  }, {
   

    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate : (record, options) => {
        console.log('32132323232');
        record.dataValues.createdAt = moment().valueOf();
        record.dataValues.updatedAt = moment().valueOf();
      },
      beforeUpdate : (record, options) => {
        console.log('gfhg');
        record.dataValues.updatedAt = moment().valueOf();
      }
    }
  });
  return User;
};