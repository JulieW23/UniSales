var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://localhost/unisaleServer');
autoIncrement.initialize(connection);
// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    _id: Number,
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstname: {
      type: String,
      default: ""
    },
    lastname: {
      type: String, 
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    __v: { 
        type: Number, 
        select: false
    }
  },
  {
      _id: false
  },
  {
    collection: 'user'
  }
);

UserSchema.plugin(autoIncrement.plugin, 'User');
// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = {
  User: mongoose.model('users', UserSchema)};