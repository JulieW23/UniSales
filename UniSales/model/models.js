var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var encrypt = require('mongoose-encryption');

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
      default: ""
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

encryptionKey = 'CwBDwGUwoM5YzBmzwWPSI+KjBKvWHaablbrEiDYh43Q='
signingKey = 'dLBm74RU4NW3e2i3QSifZDNXIXBd54yr7mZp0LKugVUa1X1UP9qoxoa3xfA7Ea4kdVL+JsPg9boGfREbPCb+kw=='

UserSchema.plugin(autoIncrement.plugin, 'User');
UserSchema.plugin(encrypt, { encryptionKey: encryptionKey, signingKey: signingKey, encryptedFields: ['password'] });
// Doc for Mongoose Models: http://mongoosejs.com/docs/models
module.exports = {
  User: mongoose.model('users', UserSchema)};