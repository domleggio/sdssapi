// User.js
var mongoose = require('mongoose'); 
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({  
  email: {type: String, unique: false, required: true },
  passwordHash: {type: String, required: true},
  passwordSalt: {type: String, required: true},
  name: {type: String,required: true},
  age:{type: Number, required: true},
  sex:{type: String,required: true},
  phoneNumber:{type: String,required: true},
  role:{type: String, required: true},
  GP:{type: String},
});

UserSchema.methods.setPassword = function(password){
  this.passwordSalt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');
  
  return this.passwordHash === hash;
  
};

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};



mongoose.model('user', UserSchema);

module.exports = mongoose.model('user');