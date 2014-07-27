var mongoose = require('mongoose');

// simple but incomplete email regexp:
var emailRegexp = /.+\@.+\..+/;

// Création du schéma
var UserSchema = new mongoose.Schema({
  name : String,
  firstname : String,
  email : {type : String, unique : true, required: true, match : emailRegexp},
  birthdate : { type : Date },
  createdOn : { type : Date, default: Date.now },
  lastLogin : { type : Date }
},
{ collection : 'user' }
);

// Création du Model
mongoose.model('User', UserSchema);
